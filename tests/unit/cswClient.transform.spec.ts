import { NEW_RECORD_XML, getCswClient } from './cswClient.mock-config';

const JSON_TO_CONVERT = {
  'ogc:SortBy': {
    TYPE_NAME: 'Filter_1_1_0.SortByType',
    sortProperty: [
      {
        TYPE_NAME: 'Filter_1_1_0.SortPropertyType',
        propertyName: {
          TYPE_NAME: 'Filter_1_1_0.PropertyNameType',
          content: ['dc:title'],
        },
        sortOrder: 'ASC',
      },
      {
        TYPE_NAME: 'Filter_1_1_0.SortPropertyType',
        propertyName: {
          TYPE_NAME: 'Filter_1_1_0.PropertyNameType',
          content: ['dc:dummy'],
        },
        sortOrder: 'DESC',
      },
    ],
  },
};

describe('CSW Client XML <--> JSON transformations', () => {
  afterEach(() => {
    // reset spy's
    jest.clearAllMocks();
  });

  it('xmlStringToJson() metod', () => {
    const csw = getCswClient(true);
    const record = csw.xmlStringToJson(NEW_RECORD_XML);

    expect(record['gmd:MD_Metadata']).toBeDefined();
  });

  it('jsonToXml() metod', () => {
    const csw = getCswClient(true);
    const sortByObject = JSON_TO_CONVERT;
    const xmlDoc = csw.jsonToXml(sortByObject);

    expect(xmlDoc.documentElement.nodeName).toBe('ogc:SortBy');
  });

  it('xmlToJson()', () => {
    const csw = getCswClient(true);
    const sortByObject = JSON_TO_CONVERT;
    const xmlDoc = csw.jsonToXml(sortByObject);
    const jsonObject = csw.xmlToJson(xmlDoc);

    expect(jsonObject).toHaveProperty('ogc:SortBy');
  });

  it('xmlToString()', () => {
    const csw = getCswClient(true);
    const sortByObject = JSON_TO_CONVERT;
    const xmlDoc = csw.jsonToXml(sortByObject);
    const xmlString = csw.xmlToString(xmlDoc);

    expect(xmlString).toContain('<ogc:SortProperty>');
  });
});
