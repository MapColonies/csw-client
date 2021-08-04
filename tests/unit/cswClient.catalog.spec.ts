import { NEW_RECORD_XML, myRequestFailed, myRequestSuccess, getCswClient } from './cswClient.mock-config';

/* eslint-disable @typescript-eslint/no-unused-vars */
describe('CSW Client Catalog related', () => {
  afterEach(() => {
    // reset spy's
    jest.clearAllMocks();
  });

  describe('GetCapabilities()', () => {
    it('GetCapabilities():REJECT method invokes httpTransport function', async () => {
      const csw = getCswClient(true);
      await csw
        .GetCapabilities()
        // eslint-disable-next-line
        .catch((error) => {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(myRequestFailed).toHaveBeenCalled();
        });
    });

    it('GetCapabilities():RESOLVE method invokes httpTransport function', async () => {
      const csw = getCswClient(false);
      // eslint-disable-next-line
      const xmlStringToJsonSpy = jest.spyOn(csw, 'xmlStringToJson').mockImplementation((xmlString: string) => {
        return {
          'csw:Capabilities': {
            serviceIdentification: {},
            serviceProvider: {},
            operationsMetadata: {},
            filterCapabilities: {},
          },
        };
      });
      await csw.GetCapabilities().then((data) => {
        expect(myRequestSuccess).toHaveBeenCalled();
        expect(xmlStringToJsonSpy).toHaveBeenCalled();
      });
    });
  });

  describe('DescribeRecord()', () => {
    it('DescribeRecord():REJECT method invokes httpTransport function', async () => {
      const csw = getCswClient(true);
      await csw.DescribeRecord().catch((error) => {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(myRequestFailed).toHaveBeenCalledTimes(1);
      });
    });

    it('DescribeRecord():RESOLVE method invokes httpTransport function', async () => {
      const csw = getCswClient(false);
      // eslint-disable-next-line
      const xmlStringToJsonSpy = jest.spyOn(csw, 'xmlStringToJson').mockImplementation((xmlString: string) => ({}));
      await csw.DescribeRecord().then((data) => {
        expect(myRequestSuccess).toHaveBeenCalled();
        expect(xmlStringToJsonSpy).toHaveBeenCalled();
      });
    });
  });

  describe('GetDomain()', () => {
    it('GetDomain():REJECT method invokes httpTransport function', async () => {
      const csw = getCswClient(true);
      const domainProperty = 'title';
      await csw.GetDomain(domainProperty).catch((error) => {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(myRequestFailed).toHaveBeenCalledTimes(1);
      });
    });

    it('GetDomain():RESOLVE method invokes httpTransport function', async () => {
      const csw = getCswClient(false);
      // eslint-disable-next-line
      const xmlStringToJsonSpy = jest.spyOn(csw, 'xmlStringToJson').mockImplementation((xmlString: string) => ({}));
      const domainProperty = 'title';
      await csw.GetDomain(domainProperty).then((data) => {
        expect(myRequestSuccess).toHaveBeenCalled();
        expect(xmlStringToJsonSpy).toHaveBeenCalled();
      });
    });
  });

  describe('GetRecords()', () => {
    it('GetRecords():REJECT method invokes httpTransport function', async () => {
      const csw = getCswClient(true);
      await csw.GetRecords('kukuschema', 1, 10, {}).catch((error) => {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(myRequestFailed).toHaveBeenCalledTimes(1);
      });
    });

    it('GetRecords():RESOLVE method invokes httpTransport function', async () => {
      const csw = getCswClient(false);
      await csw.GetRecords('kukuschema', 1, 10, {}).then((data) => {
        expect(myRequestSuccess).toHaveBeenCalled();
        expect(data).toHaveProperty('mc:MCGCRecord');
      });
    });

    it('GetRecords():RESOLVE with empty FILTER options', async () => {
      const csw = getCswClient(false);
      const opt = {
        filter: [],
      };
      await csw.GetRecords('kukuschema', 1, 10, opt).then((data) => {
        expect(myRequestSuccess).toHaveBeenCalled();
        expect(data).toHaveProperty('mc:MCGCRecord');
      });
    });

    it('GetRecords():RESOLVE with meaningfull FILTER options', async () => {
      const csw = getCswClient(false);
      const opt = {
        filter: [
          {
            field: 'mcgc:geojson',
            bbox: {
              llat: 31.9042863434239,
              llon: 34.8076891807199,
              ulat: 31.913197,
              ulon: 34.810811,
            },
          },
          {
            field: 'mcgc:name',
            like: 'Rehovot',
          },
        ],
      };
      await csw.GetRecords('kukuschema', 1, 10, opt).then((data) => {
        expect(myRequestSuccess).toHaveBeenCalled();
        expect(data).toHaveProperty('mc:MCGCRecord');
      });
    });

    it('GetRecords():RESOLVE with meaningfull FILTER & SORT options', async () => {
      const csw = getCswClient(false);
      const opt = {
        filter: [
          {
            field: 'mcgc:geojson',
            bbox: {
              llat: 31.9042863434239,
              llon: 34.8076891807199,
              ulat: 31.913197,
              ulon: 34.810811,
            },
          },
          {
            field: 'mcgc:name',
            like: 'Rehovot',
          },
        ],
        sort: [
          {
            field: 'title',
            desc: false,
          },
        ],
      };
      await csw.GetRecords('kukuschema', 1, 10, opt).then((data) => {
        expect(myRequestSuccess).toHaveBeenCalled();
        expect(data).toHaveProperty('mc:MCGCRecord');
      });
    });

    it('GetRecords():RESOLVE with ALL FILTER options', async () => {
      const csw = getCswClient(false);
      const opt = {
        filter: [
          {
            field: 'mcgc:geojson',
            bbox: {
              llat: 31.9042863434239,
              llon: 34.8076891807199,
              ulat: 31.913197,
              ulon: 34.810811,
            },
          },
          {
            field: 'mcgc:name',
            like: 'Rehovot',
          },
          {
            field: 'mcgc:name',
            eq: 'kuku',
          },
          {
            field: 'mcgc:name',
            neq: 'muku',
          },
          {
            field: 'mcgc:dummy',
            gt: '4',
          },
          {
            field: 'mcgc:dummy',
            lt: '9',
          },
          {
            field: 'mcgc:dummy',
            gteq: '4',
          },
          {
            field: 'mcgc:dummy',
            lteq: '9',
          },
          {
            field: 'mcgc:dummy',
            in: ['14', '19'] as [string, string],
          },
        ],
      };
      await csw.GetRecords('kukuschema', 1, 10, opt).then((data) => {
        expect(myRequestSuccess).toHaveBeenCalled();
        expect(data).toHaveProperty('mc:MCGCRecord');
      });
    });
  });

  describe('GetRecordsById()', () => {
    it('GetRecordsById([]):REJECT method invokes httpTransport function', async () => {
      const csw = getCswClient(true);
      await csw.GetRecordsById('kukuschema', []).catch((error) => {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(myRequestFailed).toHaveBeenCalledTimes(1);
      });
    });

    it('GetRecordsById([ids]):RESOLVE method invokes httpTransport function', async () => {
      const csw = getCswClient(false);
      // eslint-disable-next-line
      const xmlStringToJsonSpy = jest.spyOn(csw, 'xmlStringToJson').mockImplementation((xmlString: string) => ({}));
      await csw.GetRecordsById('kukuschema', ['1', '2']).then((data) => {
        expect(myRequestSuccess).toHaveBeenCalledTimes(1);
        expect(xmlStringToJsonSpy).toHaveBeenCalled();
      });
    });
  });

  describe('InsertRecords()', () => {
    it('InsertRecords([records]):RESOLVE method invokes httpTransport function', async () => {
      const csw = getCswClient(false);
      // eslint-disable-next-line
      const xmlStringToJsonSpy = jest.spyOn(csw, 'xmlStringToJson').mockImplementation((xmlString: string) => ({}));
      await csw.InsertRecords([]).then((data) => {
        expect(myRequestSuccess).toHaveBeenCalledTimes(1);
        expect(xmlStringToJsonSpy).toHaveBeenCalled();
      });
    });
  });

  describe('UpdateRecord()', () => {
    it('UpdateRecord(record):RESOLVE method invokes httpTransport function', async () => {
      const csw = getCswClient(false);
      // eslint-disable-next-line
      const record = csw.xmlStringToJson(NEW_RECORD_XML);
      // eslint-disable-next-line
      const xmlStringToJsonSpy = jest.spyOn(csw, 'xmlStringToJson').mockImplementation((xmlString: string) => ({}));
      await csw.UpdateRecord(record).then((data) => {
        expect(myRequestSuccess).toHaveBeenCalledTimes(1);
        expect(xmlStringToJsonSpy).toHaveBeenCalled();
      });
    });
  });

  describe('DeleteRecords()', () => {
    it('DeleteRecords(filter):RESOLVE method invokes httpTransport function', async () => {
      const csw = getCswClient(false);
      // eslint-disable-next-line
      const xmlStringToJsonSpy = jest.spyOn(csw, 'xmlStringToJson').mockImplementation((xmlString: string) => ({}));
      const filter = [
        {
          field: 'mcgc:dummy',
          bbox: {
            llat: 31.9042863434239,
            llon: 34.8076891807199,
            ulat: 31.913197,
            ulon: 34.810811,
          },
        },
        {
          field: 'mcgc:name',
          like: 'Rehovot',
        },
      ];
      await csw.DeleteRecords(filter).then((data) => {
        expect(myRequestSuccess).toHaveBeenCalledTimes(1);
        expect(xmlStringToJsonSpy).toHaveBeenCalled();
      });
    });
  });
});
/* eslint-enable */
