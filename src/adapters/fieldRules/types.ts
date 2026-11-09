/**
 * Minimal shape of a pycsw-to-entity property mapping entry.
 * Structurally compatible with `@map-colonies/mc-model-types`'s `IPropPYCSWMapping`,
 * declared locally so this package has no runtime dependency on mc-model-types.
 */
export interface IPycswKeyMapping {
  xmlElement: string;
  prop: string;
}

/**
 * Per-record-type field classification used by transformRecordsToEntity to decide
 * how a renamed field's raw pycsw value should be coerced.
 */
export interface FieldTypeRules {
  isFootprint: (fieldName: string) => boolean;
  isLayerPolygonParts: (fieldName: string) => boolean;
  isDiscrete: (fieldName: string) => boolean;
  isLinks: (fieldName: string) => boolean;
  isDate: (fieldName: string) => boolean;
  isKeywords: (fieldName: string) => boolean;
  isSensor: (fieldName: string) => boolean;
  isRegion: (fieldName: string) => boolean;
  isProductVersion: (fieldName: string) => boolean;
  isBoolean: (fieldName: string) => boolean;
}
