# CSW-CLIENT
This package provides client-side API for OGC CSW service(s) written in TypeScript.

Suits for Node.JS and React/Angular applications

> Package boilerplate based on [ts-npm-package-boilerplate](https://github.com/MapColonies/ts-npm-package-boilerplate)

> This Client library is based on [Jsonix](https://github.com/highsource/jsonix) and [ogc-schemas](https://github.com/highsource/ogc-schemas) libraries.

Code samples are provided by TypeScript.
## Installation
### Install package by NPM
   ```sh
   npm install @map-colonies/csw-client --save
   ```
### Install package by YARN
   ```sh
   yarn add @map-colonies/csw-client --save
   ```
## Usage
  ```typescript
  // import CswClient class 
  import { CswClient, ICapabilities } from from '@map-colonies/csw-client';

  // later in code
  const csw = new CswClient('<YOUR_OGC_CSW_SRV_URL>', <YOUR_REQUEST_EXECUTOR_FUNC>, <CONFIG>);
  // trigger one of the exposed methods
  csw.GetDomain('<propertyName>').then((data: ICapabilities) => {
    // your code
  }); 
  ```
## Implemented operations/methods
### Client library instantiation 
- **Instantiation - new**
  ```typescript
    // import CswClient class 
    import { CswClient } from from '@map-colonies/csw-client';
    import Axios, { Method } from 'axios';

    // import desired ADDITIONAL schemas
    const ISO19139_GCO_20060504 = require('ogc-schemas').ISO19139_GCO_20060504;
    const ISO19139_GMD_20060504 = require('ogc-schemas').ISO19139_GMD_20060504;
    const GML_3_2_0 = require('ogc-schemas').GML_3_2_0;

    // define your own requestExecutor
    const myRequest = async (url: string, method: string, params: Record<string, unknown>): Promise<any> => {
      const errorMsg = 'CLIENT HTTP ERROR BY AXIOS';
      return Axios.request({
        url,
        method: method as Method,
        ...params,
      })
        .then((res) => res)
        .catch((error) => {
          console.error(errorMsg);
          throw error;
        });
    };

    // later in code
    const cswConfig = {
      shemas: [
        GML_3_2_0,
        ISO19139_GCO_20060504,
        ISO19139_GMD_20060504,
      ],
      nameSpaces: {
        namespacePrefixes: { // define ADDITIONAL namespace prefixes
          'http://schema.mapcolonies.com': 'mc',
          'http://www.isotc211.org/2005/gmd': 'gmd',
          'http://www.isotc211.org/2005/gco': 'gco',
        },
      },
      credentials: {},
    };
    const csw = new CswClient('http://127.0.0.1:56477/?version=2.0.2&service=CSW', myRequest, cswConfig);
    ```
### Basic OWS operations
- **GetCapabilities(): Promise<ICapabilities>**

  Allow clients to retrieve information describing the service instance
  ```typescript
    csw.GetCapabilities().then((data: ICapabilities) => {
      ... // your code
    });
  ```
- **DescribeRecord(): Promise<any>**

  Allows a client to discover elements of the information model supported by the target catalog service
  ```typescript
    csw.DescribeRecord().then((data) => {
      ... // your code
    });
  ```
### CSW queries
- **GetDomain(propertyName: string): Promise<any>**

  Obtain runtime information about the range of values of a metadata record element or request parameter.
  ```typescript
    csw.GetDomain('title').then((data) => {
      ... // your code
    });
  ```
- **GetRecords(start: number, max: number, opts: { filter?: IFilterField[]; sort?: ISortField[] }, outputSchema: string): Promise<any>**
   
   Get metadata records according to defined **filter** and **sort order**
   ```typescript
    const options = {
      filter: [
        {
          field: 'mcgc:geojson',
          bbox: {
            llat: 31.90,
            llon: 36.80,
            ulat: 31.91,
            ulon: 36.81,
          },
        },
        {
          field: 'mcgc:name',
          like: 'magic_place',
        },
      ],
      sort: [
        {
          field: 'mcgc:name',
          desc: false,
        },
        {
          field: 'mcgc:creation_date',
          desc: true,
        },

      ]
    };
    csw.GetRecords(1, 10, options, 'http://schema.myschema.com').then((data) => {
      ... // your code
    });
  ```
- **GetRecordsById(id_list: string[]): Promise<any>**
   
   Get metadata records by ID list
   ```typescript
    csw.GetRecordsById(['1', '2', '5']).then((data) => {
      ... // your code
    });
  ```
### CSW CRUD operations
- **InsertRecords(records: any[]): Promise<any>**
   
   Create catalog records
   ```typescript
    csw.InsertRecords(records).then((data) => {
      ... // your code
    });
  ```
- **UpdateRecord(record: any): Promise<any>**
   
   Modify catalog record
   ```typescript
    csw.UpdateRecord(records).then((data) => {
      ... // your code
    });
  ```
- **DeleteRecords(filters: IFilterField[]): Promise<any>**
   
   Delete catalog records according to defined filter
   ```typescript
    csw.DeleteRecords(filters).then((data) => {
      ... // your code
    });
  ```
### Utils
- **xmlStringToJson(xmlString: string): any**
   
   Converts XML-like string to JSON object according to defined schemas
   ```typescript
    const obj = csw.xmlStringToJson(xmlString);
  ```

- **jsonToXml(json: any): XMLDocument**  
   Converts JSON object to XMLDocument according to defined schemas
   ```typescript
    const xmlDoc: XMLDocument = csw.jsonToXml(json);
  ```
- **xmlToJson(xml: XMLDocument): any**
   
   Converts XMLDocument to JSON object according to defined schemas
   ```typescript
    const obj = csw.xmlToJson(xml);
  ```
- **xmlToString(xml: XMLDocument): string**
   
   Converts XMLDocument to XML-like string according to defined schemas
   ```typescript
    const str = csw.xmlToString(xml);
  ```
### OGC Filters
- Operators:
    - Logical Operators:
        - AND
        ```typescript
            let filter: any = new FilterBuilder().PropertyName('dc:title').isLike('%water%');
            filter = filter.and(new FilterBuilder().PropertyName('dc:subject').isLike('%polution%'));
        ```
        - OR
        ```typescript
            let filter: any = new FilterBuilder().PropertyName('dc:title').isLike('%water%');
            filter = filter.or(new FilterBuilder().PropertyName('dc:title').isLike('%oil%'));
        ```

- Spatial Operatos:
    - BBOX
    ```typescript 
    let filter: any = new FilterBuilder().PropertyName('dc:title').isLike('%water%');
    filter = filter.and(new FilterBuilder().BBOX(-80, 150, 80, -150));
    ```
- Comparison
    - isLike
    - isBetween
    - isEqualTo
    - isLessThanOrEqualTo
    - isGreaterThan
    - isLessThan
    - isGreaterThanOrEqualTo
    - isNotEqualTo
### OGC Sort
```typescript
  const sort: SortBuilder = new SortBuilder().Sort('dc:title');
  sort.Sort('dc:dummy', true);
```

## Applyed patches ( _./patches/*.patch_ )
- Jsonix/ogc-schemas BBOX schema(s) definition
    - Discussion is here: https://github.com/OSGeo/ows.js/issues/9
- Jsonix ***webback-dev-server*** issue
    - Discussion is here: https://github.com/highsource/jsonix/issues/171
    - Applied patch based on: https://github.com/planetfederal/jsonix/commit/d88f68d1a62a14c09562b15cf0e6ce5e1f14fbf2