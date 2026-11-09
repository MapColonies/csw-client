import { transform, mapValues, get } from 'lodash';
import { RecordType } from '@map-colonies/types';
import { IPycswKeyMapping, FieldTypeRules } from './fieldRules/types';
import { renamePycswKeys } from './keyMapper';
import { toLinkModels } from './links';

// eslint-disable-next-line @typescript-eslint/naming-convention -- keys mirror Python's capitalized boolean literals, not ours to rename
const PYTHON_BOOLEAN_STRING_MAP: Record<string, boolean> = { True: true, False: false };

/**
 * Renames raw pycsw records' XML-element keys to domain property names and coerces
 * each value according to the supplied field rules (dates, booleans, links, JSON-encoded
 * fields, record-type-dependent fields, etc).
 */
export function transformRecordsToEntity<T = Record<string, unknown>>(
  cswArray: Record<string, unknown>[],
  pyCSWKeys: readonly IPycswKeyMapping[],
  fieldRules: FieldTypeRules
): T[] {
  const { isDate, isDiscrete, isKeywords, isLayerPolygonParts, isLinks, isSensor, isRegion, isProductVersion, isBoolean, isFootprint } = fieldRules;

  return transform<Record<string, unknown>, T[]>(
    cswArray,
    (result, cswValue) => {
      const parsedKeys = renamePycswKeys(cswValue, pyCSWKeys);
      const finalParsed = mapValues(parsedKeys, (val, key, obj) => {
        const recordType = get(obj, 'type') as RecordType;
        const SHOULD_SPECIAL_TREAT_FIELD = true;

        switch (SHOULD_SPECIAL_TREAT_FIELD) {
          case isFootprint(key): {
            return JSON.parse(val as string) as unknown;
          }
          case isLayerPolygonParts(key): {
            switch (recordType) {
              case RecordType.RECORD_RASTER:
              case RecordType.RECORD_DEM:
                return JSON.parse(val as string) as unknown;
              default:
                return {};
            }
          }
          case isDiscrete(key): {
            switch (recordType) {
              case RecordType.RECORD_RASTER:
                return JSON.parse(val as string) as unknown;
              default:
                return undefined;
            }
          }
          case isLinks(key): {
            return toLinkModels(val);
          }
          case isDate(key):
            return new Date(val as string);
          case isKeywords(key):
            return (val as string | undefined)?.toString(); //might be an Array
          case isSensor(key):
            return val !== undefined ? (val as string).split(',') : [];
          case isRegion(key):
            return val !== undefined ? (val as string).split(',') : [];
          case isProductVersion(key):
            switch (recordType) {
              case RecordType.RECORD_3D:
                return (val as string | undefined)?.toString();
              default:
                return val;
            }
          case isBoolean(key): {
            // Python booleans notations are capitalized, we should parse it to JS notation.
            if (typeof val === 'string') {
              const isBooleanValue = ['True', 'False'].includes(val);

              if (isBooleanValue) {
                return PYTHON_BOOLEAN_STRING_MAP[val];
              }
            }

            return val;
          }
          default:
            return val;
        }
      });
      result.push(finalParsed as T);
    },
    []
  );
}
