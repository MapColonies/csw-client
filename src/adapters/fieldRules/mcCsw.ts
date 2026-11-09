import { FieldTypeRules } from './types';

/**
 * Field classification for MapColonies' pycsw profile (mc_raster/mc_dem/mc_3d records,
 * i.e. the CswClient/CSW path as opposed to the WFS/vector path).
 * Ported as-is from catalog-web-app-bff's `fieldTypes` constant.
 */
export const mcCswFieldRules: FieldTypeRules = {
  isFootprint: (fieldName) => fieldName === 'footprint',
  isLayerPolygonParts: (fieldName) => fieldName === 'layerPolygonParts',
  isDate: (fieldName) =>
    [
      'creationDate',
      'ingestionDate',
      'updateDate',
      'sourceDateStart',
      'sourceDateEnd',
      'insertDate',
      'validationDate',
      'creationDateUTC',
      'updateDateUTC',
      'imagingTimeBeginUTC',
      'imagingTimeEndUTC',
    ].includes(fieldName),
  isDiscrete: (fieldName) => fieldName === 'discretes',
  isLinks: (fieldName) => fieldName === 'links',
  isKeywords: (fieldName) => fieldName === 'keywords',
  isSensor: (fieldName) => ['sensorType', 'sensors'].includes(fieldName),
  isBoolean: (fieldName) => ['hasTerrain'].includes(fieldName),
  isRegion: (fieldName) => ['region'].includes(fieldName),
  isProductVersion: (fieldName) => fieldName === 'productVersion',
};
