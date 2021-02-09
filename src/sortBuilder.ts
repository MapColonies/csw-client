import { DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS } from './defaults';

export class SortBuilder {
  /* eslint-disable */
  public constructor() {
    (this as any)['ogc:SortBy'] = {
      TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.SortByType`,
    };
  }

  public Sort(propertyName: string, desc?: boolean): SortBuilder {
    const sortInstance = (this as any)['ogc:SortBy'];
    sortInstance.sortProperty = sortInstance.sortProperty || [];
    sortInstance.sortProperty.push({
      TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.SortPropertyType`,
      propertyName: {
        TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.PropertyNameType`,
        content: [propertyName],
      },
      sortOrder: desc ? 'DESC' : 'ASC',
    });
    return this;
  }
  /* eslint-enable */
}
