define([
    'dojo/_base/declare',
    'dojo/Stateful',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/on',
    'dojo/request',
    'dojo/io-query',
    'dojo/Deferred',
    'spw/api/SpwViewer',
    'spw/api/ConfigLoader',
    'spw/libs/Jsonix-all',
    'spw/libs/ogc/OWS_1_0_0',
    'spw/libs/ogc/DC_1_1_metawal',
    'spw/libs/ogc/DCT',
    'spw/libs/ogc/XLink_1_0',
    'spw/libs/ogc/CSW_2_0_2_metawal',
    'spw/libs/ogc/Filter_1_1_0',
    'spw/libs/ogc/GML_3_1_1',
    'spw/libs/ogc/SMIL_2_0_Language',
    'spw/libs/ogc/SMIL_2_0',
    'spw/libs/ogc/GML_3_2_0',
    'spw/libs/ogc/ISO19139_GCO_20060504',
    'spw/libs/ogc/ISO19139_GMD_20060504',
    'spw/libs/ogc/ISO19139_GTS_20060504',
    'spw/libs/ogc/ISO19139_GSS_20060504',
    'spw/libs/ogc/ISO19139_GSR_20060504',
    'spw/libs/ogc/ISO19139_GMX_20060504',
    'spw/libs/ogc/ISO19139_SRV_20060504'
],
function(declare, Stateful, lang, array, on, request, ioQuery, Deferred, SpwViewer, ConfigLoader, Jsonix,
        OWS_1_0_0, DC_1_1, DCT, XLink_1_0, CSW_2_0_2, Filter_1_1_0, GML_3_1_1,
        SMIL_2_0_Language, SMIL_2_0, GML_3_2_0, ISO19139_GCO_20060504, ISO19139_GMD_20060504,
        ISO19139_GTS_20060504, ISO19139_GSS_20060504, ISO19139_GSR_20060504, ISO19139_GMX_20060504,
        ISO19139_SRV_20060504) {
    /**
     * @class spw.api.SpwCSWCatalog
     * @classdesc Classe permettant d'interroger un service CSW (catalogue de services) version 2.0.2
     */
    return declare('spw.api.SpwCSWCatalog', [Stateful], /** @lends spw.api.SpwCSWCatalog.prototype */ {
        /**
         * Pour communiquer avec le service csw
         */
        proxyPage: SpwViewer.getInstance().get('proxyPageUrl'),
        /**
         * Utiliser CORS si le serveur le permet à la place de la page proxy
         */
        useCors: true,
        
        /**
         * L'url du service
         */
        url: null,
        /**
         * Le context jsonix pour xml <-> json
         */
        jsonixContext: null,
        /**
         * Mapping des propriétés CSW <-> propriétés json d'un record (pour avoir tout le temps la même interface pour un record)
         */
        propertiesMapping: null,
        /**
         * La propriété correspondant à un map service
         */
        serviceProperty: null,
        /**
         * Les protocoles (esri-rest, wms...) possibles avec les informations permettant de le récupérer dans le record
         */
        protocols: null,
        /**
         * Filtre par défaut à appliquer aux requêtes
         */
        defaultFilter: null,
        /**
         * Sort par défaut
         */
        defaultSort: null,
        catalogGroup: 'CSWCATALOG',
        /**
         * @constructs
         */
        constructor: function(opts) {
            lang.mixin(this, opts);
            this.initContext();
        },
        /**
         * Récupère les informations d'un filtre pour un certain champ
         * @param  {String} field le champ (i.e. 'type', 'title'...)
         */
        getFilterInfo: function(field) {
            // on parcourt chaque mapping pour retrouver la propriété correspondante (mapping inverse en somme)
            for (var key in this.propertiesMapping) {
                var item = this.propertiesMapping[key];
                if (item.property === field) {
                    return lang.mixin({
                        field: key
                    }, item);
                }
            }
            return null;
        },
        /**
         * Transforme un filtre en JS classique en JS pour la transformation XML
         * @param  {Array} filter du type [ { field: 'dc:type', like: '%service%' } ]
         */
        transformFilter: function(filter) {
            var toReturn = null;
            // parcourt les filtres et les construit
            array.forEach(filter, lang.hitch(this, function(f) {
                var filterBuilder = new this.FilterBuilder().PropertyName(f.field);
                if (f.like) {
                    filterBuilder.isLike('%' + f.like + '%');
                }
                else if (f.eq) {
                    filterBuilder.isEqualTo(f.eq);
                }
                else if (f.neq) {
                    filterBuilder.isNotEqualTo(f.eq);
                }
                else if (f.gt) {
                    filterBuilder.isGreaterThan(f.eq);
                }
                else if (f.lt) {
                    filterBuilder.isLessThan(f.eq);
                }
                else if (f.gteq) {
                    filterBuilder.isGreaterThanOrEqualTo(f.eq);
                }
                else if (f.lteq) {
                    filterBuilder.isLessThanOrEqualTo(f.eq);
                }
                else if (f['in']) {
                    filterBuilder.isBetween(f['in'][0], f['in'][1]);
                }
                if (toReturn == null) {
                    toReturn = filterBuilder;
                }
                else {
                    // concaténation des filtres (and par défaut)
                    if (f.or) {
                        toReturn.or(filterBuilder);
                    }
                    else {
                        toReturn.and(filterBuilder);
                    }
                }
            }));
            return toReturn;
        },
        /**
         * Transforme un sort en JS classique en JS pour la transformation XML
         * @param  {Array} sort du type [ { field: 'dc:title', desc: true } ]
         */
        transformSort: function(sort) {
            var sortBuilder = new this.SortBuilder();
            array.forEach(sort, lang.hitch(this, function(s) {
                sortBuilder.Sort(s.field, s.desc);
            }));
            return sortBuilder;
        },
        /**
         * GetCapabilities du catalogue (pour récupérer les opérations possibles)
         * TODO: on ne l'exploite pas encore...
         */
        GetCapabilities: function() {
            var deferred = new Deferred();
            // création du json pour la transformation XML
            var getCapabilities = this._GetCapabilities();
            // json -> xml
            var xml = this.jsonToXml(getCapabilities);
            request.post(this.get('url'), {
                data: this.xmlToString(xml),
                headers: {
                    'Content-Type': 'application/xml'
                },
                handleAs: 'xml'
            }).then(lang.hitch(this, function(resp) {
                deferred.resolve(this.xmlToJson(resp));
            }), lang.hitch(this, function(err) {
                deferred.reject(err);
            }));
            return deferred;
        },
        /**
         * Opération GetRecords (récupération des entrées)
         * @param {Integer} start        id du premier record à retourner
         * @param {Integer} max          nombre max de records à retourner
         * @param {Object} opts         filter et sort
         * @param {String} outputSchema schéma xml du record en sortie
         */
        GetRecords: function(start, max, opts, outputSchema) {
            var deferred = new Deferred();
            opts = opts || {};
            var filter = null;
            var sort = null;
            // on construit le filtrage (JS classique en JS csw)
            if (opts.filter) {
                filter = this.transformFilter(opts.filter);
                if (this.defaultFilter) {
                    filter.and(this.transformFilter(this.defaultFilter));
                }
            }
            else if (this.defaultFilter) {
                filter = this.transformFilter(this.defaultFilter);
            }
            // on construit le sort de la même manière
            if (opts.sort) {
                if (this.defaultSort) {
                    opts.sort = opts.sort.concat(this.defaultSort);
                }
                sort = this.transformSort(opts.sort);
            }
            else if (this.defaultSort) {
                sort = this.transformSort(this.defaultSort);
            }
            // on construit la query de la requête
            var query = this._Query('full', filter ? this._Constraint(filter) : null, sort);
            // et on récupère le JS CSW de la requête complète
            var getRecords = this._GetRecords(start, max, query, outputSchema);
            // qu'on transforme en xml
            var xml = this.jsonToXml(getRecords);
            request.post(this.get('url'), {
                data: this.xmlToString(xml),
                headers: {
                    'Content-Type': 'application/xml'
                },
                handleAs: 'xml'
            }).then(lang.hitch(this, function(resp) {
                var json = this.xmlToJson(resp);
                // TODO: gérer les erreurs
                // on récupère les réponses
                var res = json['csw:GetRecordsResponse'];
                if (res == null) {
                    return deferred.reject('no data');
                }
                // résultats de la recherche
                var searchResults = res.searchResults;
                if (searchResults == null) {
                    return deferred.reject('no data');
                }
                // les records
                var records = searchResults.abstractRecord;
                // on récupère les infos
                var tmp = {
                    total: searchResults.numberOfRecordsMatched,
                    length: searchResults.numberOfRecordsReturned,
                    next: searchResults.nextRecord,
                    // on mappe les records CSW pour qu'ils aient la même interface en JS
                    records: array.map(records, lang.hitch(this, function(r, idx) {
                        var newRecord = {};
                        var elements = r['csw:Record'].dcElement;
                        array.forEach(elements, lang.hitch(this, function(e) {
                            this._mapRecordElement(e, newRecord);
                        }));
                        return newRecord;
                    }))
                };
                deferred.resolve(tmp);
            }), lang.hitch(this, function(err) {
                deferred.reject(err);
            }));
            return deferred;
        },
        /**
         * Est-ce que le record est un map service ?
         */
        isMapService: function(element) {
            var mapped = this._getMappedProperty(this.serviceProperty);
            if (mapped == null) {
                return false;
            }
            // on récupère les liens pouvant correspondre à des services
            var links = element[mapped.property];
            if (links == null || (mapped.type === 'array' && links.length === 0)) {
                return false;
            }
            var testLink = function(l) {
                if (l.protocol == null) {
                    return false;
                }
                // on parcourt tous le protocoles et on test si le lien en est un
                return array.some(this.protocols, lang.hitch(this, function(p) {
                    if (l.protocol.indexOf(p.protocol) >= 0) {
                        return true;
                    }
                    return false;
                }));
            };
            // on parcourt les liens et on teste s'il s'agit d'un service
            if (links.length) {
                return array.some(links, lang.hitch(this, testLink));
            }
            else {
                return testLink(links);
            }
        },
        /**
         * Mappe un record CSW en record avec une interface standard
         */
        _mapRecordElement: function(element, record) {
            // on parcourt toutes les propriétés mappées
            for (var key in this.propertiesMapping) {
                if (element[key] == null) {
                    continue;
                }
                // s'il s'agit d'une propriété mappable
                // on récupère ses infos de mapping
                var p = this.propertiesMapping[key];
                // si l'élément ne contient pas de données, on l'ignore
                if (element[key].content == null || element[key].content.length === 0) {
                    continue;
                }
                // s'il s'agit de la propriété pouvant correspondre à un map service
                if (key === this.serviceProperty) {
                    this._mapServiceProperty(element, record, key, p);
                    continue;
                }
                // sinon, on mappe
                if (p.type === 'value') {
                    record[p.property] = element[key].content[0];
                }
                else {
                    record[p.property] = record[p.property] || [];
                    record[p.property].push(element[key].content[0]);
                }
            }
        },
        /**
         * Mappe la propriété pouvant correspondre à un map service
         */
        _mapServiceProperty: function(element, record, key, p) {
            // on mappe statiquement pour ce type de propriété
            if (p.type === 'value') {
                record[p.property] = {
                    link: element[key].content[0],
                    description: p.descriptionProperty ? element[key][p.descriptionProperty] : null,
                    name : p.nameProperty ? element[key][p.nameProperty] : null,
                    protocol: p.protocolProperty ? element[key][p.protocolProperty] : null
                };
            }
            else {
                record[p.property] = record[p.property] || [];
                record[p.property].push({
                    link: element[key].content[0],
                    description: p.descriptionProperty ? element[key][p.descriptionProperty] : null,
                    name : p.nameProperty ? element[key][p.nameProperty] : null,
                    protocol: p.protocolProperty ? element[key][p.protocolProperty] : null
                });
            }
        },
        _getMappedProperty: function(property) {
            return this.propertiesMapping[property];
        },
        /**
         * Ajoute le service d'un record
         */
        addServiceFromURI: function(element) {
            var mapped = this._getMappedProperty(this.serviceProperty);
            if (mapped == null) {
                console.error('no property ' + this.serviceProperty);
                return;
            }
            // on récupère les liens pouvant correspondre à un service
            var links = element[mapped.property];
            if (mapped.type === 'array') {
                // on ajoute suivant une priorité (pour ajouter que le esri rest si on veut)
                var sorted = [];
                array.forEach(links, lang.hitch(this, function(l) {
                    // on récupère la config du service
                    var cfg = this._getMapServiceConfig(element, l);
                    if (cfg) {
                        sorted.push(cfg);
                    }
                }));
                if (sorted.length === 0) {
                    return;
                }
                // on sort le tableau suivant la priorité
                sorted = sorted.sort(function(s1, s2) {
                    return s2.priority - s1.priority;
                });
                var oldPriority = sorted[0].priority;
                // et on ajoute les services les plus prioritaires (ayant la même priorité)
                array.some(sorted, function(s) {
                    if (oldPriority != s.priority) {
                        return true;
                    }
                    oldPriority = s.priority;
                    /* l'ajout de basemap à chaud n'étant pas supporté, l'utilité est très limité
                    if (s.service.isBaseMap) {
                        SpwViewer.getInstance().get('spwMap').addBaseMap(s.service);
                    }
                    else {*/
                    SpwViewer.getInstance().get('spwMap').addMapService(s.service);
                    //}
                    return false;
                });
            }
            else {
                // si un seul lien, c'est plus facile
                var cfg = this._getMapServiceConfig(element, links);
                if (cfg) {
                    SpwViewer.getInstance().get('spwMap').addMapService(cfg.service);
                }
            }
        },
        /**
         * Récupère la config depuis le catalogue pour un certain id
         */
        _getCatalogServiceConfig: function(id) {
            var catalog = ConfigLoader.getInstance().get('catalog');
            var toReturn = null;
            array.some(catalog, lang.hitch(this, function(serviceGroup) {
                var foundGroup = (serviceGroup.code === this.catalogGroup);
                if (!foundGroup) {
                    return false;
                }
                var services = SpwViewer.getInstance().get('spwMap').getServicesFromGroup(serviceGroup);
                array.some(services, lang.hitch(this,function(service){
                    if (service.serviceId === id) {
                        toReturn = service;
                        return true;
                    }
                    return false;
                }));
                return foundGroup;
            }));
            if (toReturn) {
                delete toReturn.serviceId; // pour pouvoir ajouter plusieurs services, il ne faut pas que l'id soit repris
            }
            return toReturn;
        },
        /**
         * Permet de récupérer la config du service pour l'ajouter ensuite
         */
        _getMapServiceConfig: function(element, u) {
            if (u.protocol == null) {
                return;
            }
            var title = element[this._getMappedProperty('dc:title').property];
            var id = element[this._getMappedProperty('dc:identifier').property];
            var catalog =  this._getCatalogServiceConfig(id);
            var toReturn = null;
            array.forEach(this.protocols, lang.hitch(this, function(p) {
                if (u.protocol.indexOf(p.protocol) >= 0) {
                    // on mix les configs (record config < protocol config < catalog config)
                    toReturn = {
                        priority: p.priority == null ? 0 : p.priority,
                        service: lang.mixin(lang.mixin({
                            'serviceId': id,
                            'label': title,
                            'url': u.link
                        }, p.config), catalog)
                    };
                }
            }));
            return toReturn;
        },
        /**
         * Convertit un XML en string
         * @param xml le XML à convertir
         */
        xmlToString: function(xml) {
            return new XMLSerializer().serializeToString(xml);
        },
        /**
         * Convertit un JSON en XML
         * @param json le JSON à convertir
         */
        jsonToXml: function(json) {
            return this.jsonixContext.createMarshaller().marshalDocument(json);
        },
        /**
         * Convertit un XML en JSON
         * @param xml le XML à convertir
         */
        xmlToJson: function(xml) {
            return this.jsonixContext.createUnmarshaller().unmarshalDocument(xml);
        },
        /**
         * Initialise le contexte jsonix, le mapping des propriétés et les protocoles
         */
        initContext: function() {
            this.propertiesMapping = {
                // la propriété dc:identifier (csw) est mappée sur la propriété id de notre record
                // et il ne peut y avoir qu'un seul identifier (type: 'value')
                'dc:identifier': {
                    property: 'id',
                    type: 'value',
                    label: 'Id'
                },
                'dc:type': {
                    property: 'type',
                    type: 'value',
                    label: 'Type'
                },
                'dc:date': {
                    property: 'date',
                    type: 'value',
                    label: 'Date'
                },
                'dc:title': {
                    property: 'title',
                    type: 'value',
                    label: 'Titre'
                },
                'dc:subject': {
                    property: 'subjects',
                    type: 'array',
                    label: 'Mots-clés'
                },
                'dct:abstract': {
                    property: 'abstract',
                    type: 'value',
                    label: 'Longue description'
                },
                'dc:description': {
                    property: 'description',
                    type: 'value',
                    label: 'Description'
                },
                'dc:rights': {
                    property: 'rights',
                    type: 'value',
                    label: 'Droits'
                },
                'dc:language': {
                    property: 'language',
                    type: 'value',
                    label: 'Langue'
                },
                'dc:source': {
                    property: 'source',
                    type: 'value',
                    label: 'Source'
                },
                'dct:references': {
                    property: 'references',
                    type: 'array',
                    label: 'Liens',
                    protocolProperty: 'scheme'
                }
            };
            // TODO: conf serviceProperty et protocols pour un CSW standard
            this.serviceProperty = 'dct:references';
            this.protocols = [{
                protocol: 'ESRI:REST', // protocole décrit dans le record CSW
                priority: 10, // la priorité
                config: { // la config du service correspondant à ce protocol
                    type: 'AGS_DYNAMIC',
                    hasLegend: true,
                    alpha: 100,
                    toLoad: true,
                    visible: true,
                    identifiable: true
                }
            }, {
                protocol: 'OGC:WMS',
                config: {
                    type: 'WMS',
                    hasLegend: true,
                    alpha: 100,
                    toLoad: true,
                    visible: true,
                    identifiable: false,
                    wmsParameters: {}
                }
            }];
            // jsonix contexte en lui précisant les "schémas" qui viennent de ogc-schemas
            this.jsonixContext = new Jsonix.Jsonix.Context([
                OWS_1_0_0.OWS_1_0_0,
                DC_1_1.DC_1_1,
                DCT.DCT,
                XLink_1_0.XLink_1_0,
                SMIL_2_0.SMIL_2_0,
                SMIL_2_0_Language.SMIL_2_0_Language,
                GML_3_1_1.GML_3_1_1,
                Filter_1_1_0.Filter_1_1_0,
                CSW_2_0_2.CSW_2_0_2,
                GML_3_2_0.GML_3_2_0,
                ISO19139_GSS_20060504.ISO19139_GSS_20060504,
                ISO19139_GSR_20060504.ISO19139_GSR_20060504,
                ISO19139_GTS_20060504.ISO19139_GTS_20060504,
                ISO19139_GMD_20060504.ISO19139_GMD_20060504,
                ISO19139_GCO_20060504.ISO19139_GCO_20060504,
                ISO19139_SRV_20060504.ISO19139_SRV_20060504
            ], {
                // les namespaces et leur préfixe
                namespacePrefixes: {
                    'http://www.opengis.net/cat/csw/2.0.2': 'csw',
                    'http://www.opengis.net/ogc': 'ogc',
                    'http://www.opengis.net/gml': 'gml',
                    'http://purl.org/dc/elements/1.1/':'dc',
                    'http://purl.org/dc/terms/':'dct',
                    'http://www.isotc211.org/2005/gmd' : 'gmd',
                    'http://www.isotc211.org/2005/gco' : 'gco'
                },
                mappingStyle: 'simplified'
            });
        },
        _urlGetter: function() {
            if (this.proxyPage && this.useCors !== true) {
                return this.proxyPage + '?' + this.url;
            }
            return this.url;
        },
        /**
         * JSON correspondant au XML pour l'opération GetCapabilities
         */
        _GetCapabilities: function () {
            return {
                'csw:GetCapabilities': {
                    'TYPE_NAME': 'CSW_2_0_2.GetCapabilitiesType',
                    'service': 'CSW',
                    'acceptVersions': {
                        'TYPE_NAME': 'OWS_1_0_0.AcceptVersionsType',
                        'version': ['2.0.2']
                    },
                    'acceptFormats': {
                        'TYPE_NAME': 'OWS_1_0_0.AcceptFormatsType',
                        'outputFormat': ['application/xml']
                    }
                }
            };
        },
        /**
         * JSON correspondant au XML pour l'opération GetRecords
         */
        _GetRecords: function(startPosition, maxRecords, query, outputSchema){
            var tmp = {
                'csw:GetRecords': {
                    TYPE_NAME: 'CSW_2_0_2.GetRecordsType',
                    abstractQuery: query,
                    startPosition: startPosition,
                    maxRecords: maxRecords,
                    resultType: 'results',
                    service: 'CSW',
                    version: '2.0.2'
                }
            };
            if (outputSchema) {
                tmp['csw:GetRecords'].outputSchema = outputSchema;
            }
            return tmp;
        },
        /**
         * JSON correspondant à une contrainte (filtre)
         */
        _Constraint: function(filter) {
            return {
                TYPE_NAME: "CSW_2_0_2.QueryConstraintType",
                version: "1.1.0",
                filter: filter
            };
        },
        /**
         * JSON correspondant à une Query (filter/sort)
         */
        _Query: function(elementSetName, constraint, sort) {
            var tmp = {
                'csw:Query': {
                    TYPE_NAME: 'CSW_2_0_2.QueryType',
                    elementSetName: {
                        TYPE_NAME: 'CSW_2_0_2.ElementSetNameType',
                        value: elementSetName
                    },
                    typeNames: [
                        {
                            key: '{http://www.opengis.net/cat/csw/2.0.2}Record',
                            localPart: 'Record',
                            namespaceURI: 'http://www.opengis.net/cat/csw/2.0.2',
                            prefix: 'csw',
                            string: '{http://www.opengis.net/cat/csw/2.0.2}csw:Record'
                        }
                    ]
                }
            };
            if (constraint) {
                tmp['csw:Query'].constraint = constraint;
            }
            if (sort) {
                tmp['csw:Query'].sortBy = sort;
            }
            return tmp;
        },
        /**
         * FilterBuilder pour construire le JSON du filtre facilement
         */
        FilterBuilder: declare(null, {
            constructor: function() {
                this['ogc:Filter'] = {
                    TYPE_NAME : "Filter_1_1_0.FilterType"
                };
            },
            PropertyName: function (propertyName) {
                // Temporary values
                this.tmp ={};
                // Temporary PropertyName
                this.tmp.PropertyName = propertyName;
                return this;
            },
            isLike: function(value) {
                this['ogc:Filter'].comparisonOps = {
                    'ogc:PropertyIsLike' : {
                        TYPE_NAME: "Filter_1_1_0.PropertyIsLikeType",
                        escapeChar: "",
                        singleChar: "_",
                        wildCard: "%",
                        literal: {
                            TYPE_NAME: "Filter_1_1_0.LiteralType",
                            content: [value]
                        },
                        propertyName: {
                            TYPE_NAME: "Filter_1_1_0.PropertyNameType",
                            content: [this.tmp.PropertyName]
                        }
                    }
                };
                // Delete the tmp property to prevent jsonix fail.
                delete this.tmp;
                return this;
            },
            isNull: function(value) {
                throw 'Not Implemented yet';
            },
            isBetween: function(lowerValue, upperValue) {
                this['ogc:Filter'].comparisonOps = {
                    'ogc:PropertyIsBetween' : {
                        TYPE_NAME: "Filter_1_1_0.PropertyIsBetweenType",
                        expression :{
                            'ogc:PropertyName': {
                                TYPE_NAME: "Filter_1_1_0.PropertyNameType",
                                content: [this.tmp.PropertyName]
                            }
                        },
                        lowerBoundary:{
                            expression: {
                                'ogc:Literal':{
                                    TYPE_NAME: "Filter_1_1_0.LiteralType",
                                    content :[lowerValue]
                                }
                            }
                        },
                        upperBoundary:{
                            expression: {
                                'ogc:Literal':{
                                    TYPE_NAME: "Filter_1_1_0.LiteralType",
                                    content :[upperValue]
                                }
                            }
                        }
                    }
                };
                // Delete the tmp property to prevent jsonix fail.
                delete this.tmp;
                return this;
            },
            isEqualTo: function(value) {
                this['ogc:Filter'].comparisonOps = {
                    'ogc:PropertyIsEqualTo': {
                        TYPE_NAME: "Filter_1_1_0.PropertyIsEqualTo",
                        matchCase: false,
                        expression: [{
                            'ogc:Literal': {
                                TYPE_NAME: "Filter_1_1_0.LiteralType",
                                content: [value]
                            }
                        }, {
                            'ogc:PropertyName': {
                                TYPE_NAME: "Filter_1_1_0.PropertyNameType",
                                content: [this.tmp.PropertyName]
                            }
                        }]
                    }
                };
                // Delete the tmp property to prevent jsonix fail.
                delete this.tmp;
                return this;
            },
            isLessThanOrEqualTo: function(value) {
                this['ogc:Filter'].comparisonOps = {
                    'ogc:PropertyIsLessThanOrEqualTo' : {
                        TYPE_NAME: "Filter_1_1_0.PropertyIsLessThanOrEqualTo",
                        expression: [{
                            'ogc:Literal': {
                                TYPE_NAME: "Filter_1_1_0.LiteralType",
                                content: [value]
                            }
                        }, {
                            'ogc:PropertyName': {
                                TYPE_NAME: "Filter_1_1_0.PropertyNameType",
                                content: [this.tmp.PropertyName]
                            }
                        }]
                    }
                };
                // Delete the tmp property to prevent jsonix fail.
                delete this.tmp;
                return this;
            },
            isGreaterThan: function(value) {
                this['ogc:Filter'].comparisonOps = {
                    'ogc:PropertyIsGreaterThan' : {
                        TYPE_NAME: "Filter_1_1_0.PropertyIsGreaterThan",
                        expression: [{
                            'ogc:Literal': {
                                TYPE_NAME: "Filter_1_1_0.LiteralType",
                                content: [value]
                            }
                        }, {
                            'ogc:PropertyName': {
                                TYPE_NAME: "Filter_1_1_0.PropertyNameType",
                                content: [this.tmp.PropertyName]
                            }
                        }]
                    }
                };
                // Delete the tmp property to prevent jsonix fail.
                delete this.tmp;
                return this;
            },
            isLessThan: function(value) {
                this['ogc:Filter'].comparisonOps = {
                    'ogc:PropertyIsLessThan' : {
                        TYPE_NAME: "Filter_1_1_0.PropertyIsLessThan",
                        expression: [{
                            'ogc:Literal': {
                                TYPE_NAME: "Filter_1_1_0.LiteralType",
                                content: [value]
                            }
                        }, {
                            'ogc:PropertyName': {
                                TYPE_NAME: "Filter_1_1_0.PropertyNameType",
                                content: [this.tmp.PropertyName]
                            }
                        }]
                    }
                };
                // Delete the tmp property to prevent jsonix fail.
                delete this.tmp;
                return this;
            },
            isGreaterThanOrEqualTo: function(value) {
                this['ogc:Filter'].comparisonOps = {
                    'ogc:PropertyIsGreaterThanOrEqualTo' : {
                        TYPE_NAME: "Filter_1_1_0.PropertyIsGreaterThanOrEqualTo",
                        expression: [{
                            'ogc:Literal': {
                                TYPE_NAME: "Filter_1_1_0.LiteralType",
                                content: [value]
                            }
                        }, {
                            'ogc:PropertyName': {
                                TYPE_NAME: "Filter_1_1_0.PropertyNameType",
                                content: [this.tmp.PropertyName]
                            }
                        }]
                    }
                };
                // Delete the tmp property to prevent jsonix fail.
                delete this.tmp;
                return this;
            },
            isNotEqualTo: function(value) {
                this['ogc:Filter'].comparisonOps = {
                    'ogc:PropertyIsNotEqualTo' : {
                        TYPE_NAME: "Filter_1_1_0.PropertyIsNotEqualTo",
                        expression: [{
                            'ogc:Literal': {
                                TYPE_NAME: "Filter_1_1_0.LiteralType",
                                content: [value]
                            }
                        }, {
                            'ogc:PropertyName': {
                                TYPE_NAME: "Filter_1_1_0.PropertyNameType",
                                content: [this.tmp.PropertyName]
                            }
                        }]
                    }
                };
                // Delete the tmp property to prevent jsonix fail.
                delete this.tmp;
                return this;
            },
            and: function(filter) {
                if (typeof this['ogc:Filter'].logicOps === 'undefined') {
                    //console.debug('The first And');
                    this['ogc:Filter'].logicOps = {
                        'ogc:And':{
                            TYPE_NAME: "Filter_1_1_0.BinaryLogicOpType"
                            //comparisonOpsOrSpatialOpsOrLogicOps: []
                        }
                    };
                    /**
                     *   TODO We need to check if the filter/operator is a
                     *   GeometryOperands, SpatialOperators(spatialOps), ComparisonOperators
                     *   (comparisonOps), ArithmeticOperators or is a composition of them
                     *   "comparisonOpsOrSpatialOpsOrLogicOps" at the moment only supports
                     *   Filter.isLike().and(Filter.isLike()) or SpatialOps (ex: BBOX);
                     */
                    if (typeof this['ogc:Filter'].comparisonOps !== 'undefined') {
                        // Only has one previous filter and it is a comparison operator.
                        // Now is ops before was comparisonOpsOrSpatialOpsOrLogicOps
                        this['ogc:Filter'].logicOps['ogc:And'].ops = [this['ogc:Filter'].comparisonOps].concat(filter.getPreviousOperator());
                        delete this['ogc:Filter'].comparisonOps;
                    } else if (typeof this['ogc:Filter'].spatialOps !== 'undefined'){
                        // Only has one previous filter and it is a spatial operator.
                        this['ogc:Filter'].logicOps['ogc:And'].ops = [this['ogc:Filter'].spatialOps].concat(filter.getPreviousOperator());
                        delete this['ogc:Filter'].spatialOps;
                    } else {
                        throw 'Not Implemented yet, another operators';
                    }
                } else {
                    // It has two or more previous operators. TODO They must be And Operator fix to accept 'ogc:Or'.
                    this['ogc:Filter'].logicOps['ogc:And'].ops = this['ogc:Filter'].logicOps['ogc:And'].ops.concat(filter.getPreviousOperator());
                }
                return this;
            },
            or: function(filter) {
                if (typeof this['ogc:Filter'].logicOps === 'undefined') {
                    //console.debug('The first Or');
                    this['ogc:Filter'].logicOps = {
                        'ogc:Or':{
                            TYPE_NAME: "Filter_1_1_0.BinaryLogicOpType"
                            //comparisonOpsOrSpatialOpsOrLogicOps: []
                        }
                    };
                    /**
                     *   TODO We need to check if the filter/operator is a
                     *   GeometryOperands, SpatialOperators(spatialOps), ComparisonOperators
                     *   (comparisonOps), ArithmeticOperators or is a composition of them
                     *   "comparisonOpsOrSpatialOpsOrLogicOps" at the moment only supports
                     *   Filter.isLike().and(Filter.isLike()) or SpatialOps (ex: BBOX);
                     */
                    if (typeof this['ogc:Filter'].comparisonOps !== 'undefined') {
                        // Only has one previous filter and it is a comparison operator.
                        this['ogc:Filter'].logicOps['ogc:Or'].ops = [this['ogc:Filter'].comparisonOps].concat(filter.getPreviousOperator());
                        delete this['ogc:Filter'].comparisonOps;
                    } else if (typeof this['ogc:Filter'].spatialOps !== 'undefined'){
                        // Only has one previous filter and it is a spatial operator.
                        this['ogc:Filter'].logicOps['ogc:Or'].ops = [this['ogc:Filter'].spatialOps].concat(filter.getPreviousOperator());
                        delete this['ogc:Filter'].spatialOps;
                    } else {
                        throw 'Not Implemented yet, another operators';
                    }
                } else {
                    // It has two or more previous operators. TODO They must be And Operator fix to accept 'ogc:And'.
                    this['ogc:Filter'].logicOps['ogc:Or'].ops = this['ogc:Filter'].logicOps['ogc:Or'].ops.concat(filter.getPreviousOperator());
                }
                return this;
            },
            not: function(filter) {
                throw 'Not Implemented yet';
            },
            getPreviousOperator: function() {
                var operator;
                var filter = this;
                if (typeof filter['ogc:Filter'].comparisonOps !== 'undefined') {
                    // Only has one previous filter and it is a comparison operator.
                    operator = filter['ogc:Filter'].comparisonOps;
                } else if (typeof filter['ogc:Filter'].spatialOps !== 'undefined'){
                    // Only has one previous filter and it is a spatial operator.
                    operator = filter['ogc:Filter'].spatialOps;
                } else if (typeof filter['ogc:Filter'].logicOps !== 'undefined') {
                    operator = filter['ogc:Filter'].logicOps;
                } else {
                    console.error(filter);
                    throw 'Not Implemented yet, another operators';
                }
                return operator;
            },
            BBOX: function(llat, llon, ulat, ulon, srsName) {
                this['ogc:Filter'].spatialOps = {
                    'ogc:BBOX' : {
                        TYPE_NAME: "Filter_1_1_0.BBOXType",
                        envelope :{
                            'gml:Envelope' : {
                                TYPE_NAME: "GML_3_1_1.EnvelopeType",
                                lowerCorner: {
                                    TYPE_NAME: "GML_3_1_1.DirectPositionType",
                                    value : [llat, llon]
                                },
                                upperCorner : {
                                    TYPE_NAME: "GML_3_1_1.DirectPositionType",
                                    value : [ulat, ulon]
                                },
                                srsName: srsName
                            }
                        },
                        propertyName :{
                            TYPE_NAME: "Filter_1_1_0.PropertyNameType",
                            content: "ows:BoundingBox"
                        }
                    }
                };
                return this;
            }
        }),
        /**
         * SortBuiler pour construire le JSON du sort facilement
         */
        SortBuilder: declare(null, {
            constructor: function() {
                this['ogc:SortBy'] = {
                    TYPE_NAME : "Filter_1_1_0.SortByType"
                };
            },
            Sort: function(propertyName, desc) {
                this['ogc:SortBy'].sortProperty = this['ogc:SortBy'].sortProperty || [];
                this['ogc:SortBy'].sortProperty.push({
                    TYPE_NAME: "Filter_1_1_0.SortPropertyType",
                    propertyName: {
                        TYPE_NAME: "Filter_1_1_0.PropertyNameType",
                        content: [propertyName]
                    },
                    sortOrder: desc ? 'DESC': 'ASC'
                });
                return this;
            }
        })
    });
});