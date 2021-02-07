import { FilterBuilder } from './filterBuilder';
import { SortBuilder } from './sortBuilder';
import { CSW_VERSION, DEFAUL_SCHEMAS, DEFAULT_NAMESPACES, DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS } from './defaults';
import { IRequestExecutor, ICSWConfig, IFilterField, ICapabilities, ISortField } from './models/interfaces';

const Jsonix = require('jsonix').Jsonix;
const xmlserializer = require('xmlserializer');

export class CswClient {
  version: string;
  url: string;
  credentials = {};
  serviceProperty = 'dct:references';
  jsonnixContext: any;
  defaultFilter: any = null;
  defaultSort: any = null;
  propertiesMapping: any;
  protocols: any[] = [];
  requestExecutor: IRequestExecutor;

  constructor(url: string, requestExecutor: IRequestExecutor, config: ICSWConfig) {
    this.version = CSW_VERSION;

    if (config == null) {
      throw 'Missing Configuration! It is a must to CSW to know the profile';
    } else if (config.credentials !== undefined) {
      this.credentials = config.credentials;
    }
    if (url.length === 0) {
      throw 'CSW server URL is missing!';
    }
    this.url = url;
    this.requestExecutor = requestExecutor;

    this._initJsonixContext(config);
    this._initContext();
  }

  /**
   *
   * Operations List:
   *
   * GetCapabilities    --> V
   * DescribeRecord     --> V
   * GetDomain          --> V
   * GetRecordById      --> V
   * GetRecords         --> V
   * InsertRecords      --> V
   * UpdateRecord       --> V
   * DeleteRecords      --> V
   * Harvest
   *
   * */

  /**
   * Operation name: GetCapabilities
   *
   */
  public GetCapabilities(): Promise<ICapabilities> {
    // creeate json by transformation XML
    const getCapabilities = this._GetCapabilities();

    return this._httpPost(getCapabilities).then((resp) => {
      const capabilities = this.xmlStringToJson(resp.data)['csw:Capabilities'];
      return Promise.resolve({
        serviceIdentification: capabilities.serviceIdentification,
        serviceProvider: capabilities.serviceProvider,
        operationsMetadata: capabilities.operationsMetadata,
        filterCapabilities: capabilities.filterCapabilities,
      });
    });
  }

  /**
   * Operation name: DescribeRecord
   *
   */
  public DescribeRecord(): Promise<any> {
    return this.requestExecutor(this.url + '&request=DescribeRecord', 'GET', {}).then((resp) => {
      const describeRecord = this.xmlStringToJson(resp.data);
      return Promise.resolve(describeRecord);
    });
  }

  /**
   * Operation name: GetDomain
   * @param {String} propertyName        property name to extract a unique values for
   * */
  public GetDomain(propertyName: string) {
    const getdomainAction = this._GetDomain(propertyName);

    return this._httpPost(getdomainAction).then((resp) => {
      const domain = this.xmlStringToJson(resp.data);
      return Promise.resolve(domain);
    });
  }

  /**
   * Operation GetRecords
   * @param {Integer} start        start index
   * @param {Integer} max          number of max records to return
   * @param {Object} opts          filter or/and sort
   * @param {String} outputSchema  xml schema of returned records
   */
  public GetRecords(start: number, max: number, opts: { filter?: IFilterField[]; sort?: ISortField[] }, outputSchema: string): Promise<any> {
    opts = opts || {};
    let filter = null;
    let sort = null;

    // build filters
    if (opts.filter) {
      filter = this.transformFilter(opts.filter);
      if (this.defaultFilter) {
        filter.and(this.transformFilter(this.defaultFilter));
      }
    } else if (this.defaultFilter) {
      filter = this.transformFilter(this.defaultFilter);
    }

    // build sort
    if (opts.sort) {
      if (this.defaultSort) {
        opts.sort = opts.sort.concat(this.defaultSort);
      }
      sort = this.transformSort(opts.sort);
    } else if (this.defaultSort) {
      sort = this.transformSort(this.defaultSort);
    }
    // build csw query
    const query = this._Query('full', filter ? this._Constraint(filter) : null, sort);
    // finalize request body
    const getRecords = this._GetRecords(start, max, query, outputSchema);
    return this._httpPost(getRecords).then((resp) => {
      return Promise.resolve(resp.data);

      // TODO: parse returned XML, currently mapcolonies schema not defined
      const json = this.xmlStringToJson(this._clearResponseXMLString(resp.data));
      const res = json['csw:GetRecordsResponse'];
      if (res == null) {
        return Promise.reject('no data');
      }

      const searchResults = res.searchResults;
      if (searchResults == null) {
        return Promise.reject('no data');
      }
      const records = searchResults.abstractRecord;
      const tmp = {
        total: searchResults.numberOfRecordsMatched,
        length: searchResults.numberOfRecordsReturned,
        next: searchResults.nextRecord,
        records: records.map((record: any) => {
          const newRecord = {};
          const elements = record['csw:Record'].dcElement;
          elements.forEach((element: any) => {
            this._mapRecordElement(element, newRecord);
          });
          return newRecord;
        }),
      };
      Promise.resolve(tmp);
    });
  }

  /**
   * Operation GetRecordsById
   * @param {Integer[]} id_list        list of record ids to fetch
   */
  public GetRecordsById(id_list: string[]) {
    const byIdAction = this._GetRecordsById(id_list);

    return this._httpPost(byIdAction).then((resp) => {
      return Promise.resolve(this.xmlStringToJson(resp.data));
    });
  }

  /**
   * Operation InsertRecords
   * @param {any[]} records        array of records to be inserted
   */
  public InsertRecords(records: any[]) {
    const transactionAction = this._Insert(records);
    const transaction = this._Transaction(transactionAction);

    return this._httpPost(transaction).then((resp) => {
      // const insert = this.xmlStringToJson(this._clearResponseXMLString(resp.data));
      // return Promise.resolve(insert);
      return Promise.resolve(this.xmlStringToJson(resp.data));
    });
  }

  /**
   * Operation UpdateRecord
   * @param {any} record        an updated record object to store
   */
  public UpdateRecord(record: any) {
    const transactionAction = this._Update(record);
    const transaction = this._Transaction(transactionAction);

    return this._httpPost(transaction).then((resp) => {
      // const update = this.xmlStringToJson(this._clearResponseXMLString(resp.data));
      // return Promise.resolve(update);
      return Promise.resolve(this.xmlStringToJson(resp.data));
    });
  }

  /**
   * Operation DeleteRecords
   * @param {IFilterField[]} filters        delete records due to supplied filters
   */
  public DeleteRecords(filters: IFilterField[]) {
    const transactionAction = this._Delete(this.transformFilter(filters));
    const transaction = this._Transaction(transactionAction);

    return this._httpPost(transaction).then((resp) => {
      // const delete = this.xmlStringToJson(this._clearResponseXMLString(resp.data));
      // return Promise.resolve(delete);
      return Promise.resolve(this.xmlStringToJson(resp.data));
    });
  }

  /**
   * Converts a XML string to JSON
   * @param {String} xmlString to be converted
   */
  public xmlStringToJson(xmlString: string) {
    return this.jsonnixContext.createUnmarshaller().unmarshalString(xmlString);
  }

  /**
   * Converts a JSON to XML
   * @param {any} json JSON to be converted due to configured schemas
   */
  public jsonToXml(json: {}) {
    return this.jsonnixContext.createMarshaller().marshalDocument(json);
  }

  /**
   * Converts a XML to JSON
   * @param {Document } xml XML to be converted
   */
  public xmlToJson(xml: any) {
    return this.jsonnixContext.createUnmarshaller().unmarshalDocument(xml);
  }

  /**
   * Converts  XML to string
   * @param xml XML to be converted
   */
  public xmlToString(xml: any) {
    return xmlserializer.serializeToString(xml);
  }

  private _httpPost(obj: any): Promise<any> {
    // json -> xml
    const xml = this.jsonToXml(obj);
    const xmlBody = this.xmlToString(xml);
    const data = {
      data: xmlBody,
      headers: {
        'Content-Type': 'application/xml',
        'Content-Length': xmlBody.length,
      },
      handleAs: 'xml',
    };
    return this.requestExecutor(this.url, 'POST', data);
  }

  private _clearResponseXMLString(xmlString: string) {
    let retData = xmlString.replace('<!-- pycsw 2.7.dev0 -->', '');
    return retData.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', '');
  }

  private _initJsonixContext(config: ICSWConfig) {
    this.jsonnixContext = new Jsonix.Context([...DEFAUL_SCHEMAS, ...config.shemas], {
      namespacePrefixes: {
        ...DEFAULT_NAMESPACES.namespacePrefixes,
        ...config.nameSpaces.namespacePrefixes,
      },
      mappingStyle: config.nameSpaces.mappingStyle ?? DEFAULT_NAMESPACES.mappingStyle,
    });
  }

  private _initContext() {
    this.propertiesMapping = {
      'dc:identifier': {
        property: 'id',
        type: 'value',
        label: 'Id',
      },
      'dc:type': {
        property: 'type',
        type: 'value',
        label: 'Type',
      },
      'dc:date': {
        property: 'date',
        type: 'value',
        label: 'Date',
      },
      'dc:title': {
        property: 'title',
        type: 'value',
        label: 'Titre',
      },
      'dc:subject': {
        property: 'subjects',
        type: 'array',
        label: 'Mots-clés',
      },
      'dct:abstract': {
        property: 'abstract',
        type: 'value',
        label: 'Longue description',
      },
      'dc:description': {
        property: 'description',
        type: 'value',
        label: 'Description',
      },
      'dc:rights': {
        property: 'rights',
        type: 'value',
        label: 'Droits',
      },
      'dc:language': {
        property: 'language',
        type: 'value',
        label: 'Langue',
      },
      'dc:source': {
        property: 'source',
        type: 'value',
        label: 'Source',
      },
      'dct:references': {
        property: 'references',
        type: 'array',
        label: 'Liens',
        protocolProperty: 'scheme',
      },
    };
    this.protocols = [
      {
        protocol: 'ESRI:REST',
        priority: 10,
        config: {
          type: 'AGS_DYNAMIC',
          hasLegend: true,
          alpha: 100,
          toLoad: true,
          visible: true,
          identifiable: true,
        },
      },
      {
        protocol: 'OGC:WMS',
        config: {
          type: 'WMS',
          hasLegend: true,
          alpha: 100,
          toLoad: true,
          visible: true,
          identifiable: false,
          wmsParameters: {},
        },
      },
    ];
  }

  private _mapServiceProperty(element: any, record: any, key: string, p: any) {
    if (p.type === 'value') {
      record[p.property] = {
        link: element[key].content[0],
        description: p.descriptionProperty ? element[key][p.descriptionProperty] : null,
        name: p.nameProperty ? element[key][p.nameProperty] : null,
        protocol: p.protocolProperty ? element[key][p.protocolProperty] : null,
      };
    } else {
      record[p.property] = record[p.property] || [];
      record[p.property].push({
        link: element[key].content[0],
        description: p.descriptionProperty ? element[key][p.descriptionProperty] : null,
        name: p.nameProperty ? element[key][p.nameProperty] : null,
        protocol: p.protocolProperty ? element[key][p.protocolProperty] : null,
      });
    }
  }

  /**
   * Map a record CSW record according to interface standard
   */
  private _mapRecordElement(element: any, record: any) {
    for (const key in this.propertiesMapping) {
      if (element[key] === null) {
        continue;
      }

      const p = this.propertiesMapping[key];
      if (element[key].content === null || element[key].content.length === 0) {
        continue;
      }

      if (key === this.serviceProperty) {
        this._mapServiceProperty(element, record, key, p);
        continue;
      }

      if (p.type === 'value') {
        record[p.property] = element[key].content[0];
      } else {
        record[p.property] = record[p.property] || [];
        record[p.property].push(element[key].content[0]);
      }
    }
  }

  private transformSort(sort: ISortField[]): any {
    const sortBuilder = new SortBuilder();
    sort.forEach((s: any) => {
      sortBuilder.Sort(s.field, s.desc);
    });
    return sortBuilder;
  }

  private transformFilter(filter: IFilterField[]): any {
    let toReturn: any = null;
    filter.forEach((f: IFilterField) => {
      const filterBuilder = new FilterBuilder().PropertyName(f.field);
      if (f.like) {
        filterBuilder.isLike('%' + f.like + '%');
      } else if (f.eq) {
        filterBuilder.isEqualTo(f.eq);
      } else if (f.neq) {
        filterBuilder.isNotEqualTo(f.neq);
      } else if (f.gt) {
        filterBuilder.isGreaterThan(f.gt);
      } else if (f.lt) {
        filterBuilder.isLessThan(f.lt);
      } else if (f.gteq) {
        filterBuilder.isGreaterThanOrEqualTo(f.gteq);
      } else if (f.lteq) {
        filterBuilder.isLessThanOrEqualTo(f.lteq);
      } else if (f.in) {
        filterBuilder.isBetween(f.in[0], f.in[1]);
      } else if (f.bbox) {
        filterBuilder.BBOX(f.bbox.llat, f.bbox.llon, f.bbox.ulat, f.bbox.ulon);
      }

      if (toReturn == null) {
        toReturn = filterBuilder;
      } else {
        // concatenation of filtres (and the default)
        if (f.or) {
          toReturn.or(filterBuilder);
        } else {
          toReturn.and(filterBuilder);
        }
      }
    });
    return toReturn;
  }

  private _GetCapabilities() {
    return {
      'csw:GetCapabilities': {
        TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.CSW}.GetCapabilitiesType`,
        service: 'CSW',
        acceptVersions: {
          TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.OWS}.AcceptVersionsType`,
          version: [CSW_VERSION],
        },
        acceptFormats: {
          TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.OWS}.AcceptFormatsType`,
          outputFormat: ['application/xml'],
        },
      },
    };
  }

  private _Query(elementSetName: string, constraint?: any, sort?: any) {
    const tmp = {
      'csw:Query': {
        TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.CSW}.QueryType`,
        elementSetName: {
          TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.CSW}.ElementSetNameType`,
          value: elementSetName,
        },
        typeNames: [
          {
            key: `{http://www.opengis.net/cat/csw/${CSW_VERSION}}Record`,
            localPart: 'Record',
            namespaceURI: `http://www.opengis.net/cat/csw/${CSW_VERSION}`,
            prefix: 'csw',
            string: `{http://www.opengis.net/cat/csw/${CSW_VERSION}}csw:Record`,
          },
        ],
      },
    };
    if (constraint) {
      (tmp as any)['csw:Query'].constraint = constraint;
    }
    if (sort) {
      (tmp as any)['csw:Query'].sortBy = sort;
    }
    return tmp;
  }

  private _Constraint(filter: any) {
    return {
      TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.CSW}.QueryConstraintType`,
      version: CSW_VERSION,
      filter: filter,
    };
  }

  private _GetRecords(startPosition: number, maxRecords: number, query: any, outputSchema: string) {
    const tmp = {
      'csw:GetRecords': {
        TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.CSW}.GetRecordsType`,
        abstractQuery: query,
        startPosition: startPosition,
        maxRecords: maxRecords,
        resultType: 'results',
        service: 'CSW',
        version: CSW_VERSION,
      },
    };
    if (outputSchema) {
      (tmp as any)['csw:GetRecords'].outputSchema = outputSchema;
    }
    return tmp;
  }

  private _GetRecordsById(ids: string[]) {
    return {
      'csw:GetRecordById': {
        TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.CSW}.GetRecordByIdType`,
        elementSetName: {
          ObjectTYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.CSW}.ElementSetNameType`,
          value: 'full',
        },
        id: ids,
        service: 'CSW',
        version: CSW_VERSION,
      },
    };
  }

  private _GetDomain(propertyName: string) {
    return {
      'csw:GetDomain': {
        TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.CSW}.GetDomainType`,
        propertyName: propertyName,
        service: 'CSW',
        version: CSW_VERSION,
      },
    };
  }

  private _Transaction = function (action: any) {
    return {
      'csw:Transaction': {
        TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.CSW}.TransactionType`,
        insertOrUpdateOrDelete: [action],
        service: 'CSW',
        version: CSW_VERSION,
      },
    };
  };

  private _Insert(records: any[]) {
    return {
      TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.CSW}.InsertType`,
      any: records,
    };
  }

  private _Update(record: any) {
    return {
      TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.CSW}.UpdateType`,
      any: record,
    };
  }

  private _Delete(filter: any) {
    return {
      TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.CSW}.DeleteType`,
      constraint: {
        TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.CSW}.QueryConstraintType`,
        filter: filter,
        version: CSW_VERSION,
      },
    };
  }
}
