const XLink_1_0 = require('w3c-schemas').XLink_1_0;
const OWS_1_0_0 = require('ogc-schemas').OWS_1_0_0;
const DC_1_1 = require('ogc-schemas').DC_1_1;
const DCT = require('ogc-schemas').DCT;
const CSW_2_0_2 = require('ogc-schemas').CSW_2_0_2;
const Filter_1_1_0 = require('ogc-schemas').Filter_1_1_0;
const SMIL_2_0_Language = require('ogc-schemas').SMIL_2_0_Language;
const SMIL_2_0 = require('ogc-schemas').SMIL_2_0;
const GML_3_1_1 = require('ogc-schemas').GML_3_1_1;

export const CSW_VERSION = '2.0.2';

export const DEFAUL_SCHEMAS = [OWS_1_0_0, DC_1_1, DCT, XLink_1_0, SMIL_2_0, SMIL_2_0_Language, GML_3_1_1, Filter_1_1_0, CSW_2_0_2];

export const DEFAULT_NAMESPACES = {
  namespacePrefixes: {
    'http://www.opengis.net/cat/csw/2.0.2': 'csw',
    'http://www.opengis.net/ogc': 'ogc',
    'http://www.opengis.net/gml': 'gml',
    'http://www.opengis.net/ows': 'ows',
    'http://purl.org/dc/elements/1.1/': 'dc',
    'http://purl.org/dc/terms/': 'dct',
  },
  mappingStyle: 'simplified',
};

export const DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS = {
  CSW: 'CSW_2_0_2',
  OWS: 'OWS_1_0_0',
  FILTER: 'Filter_1_1_0',
  GML: 'GML_3_1_1',
};
