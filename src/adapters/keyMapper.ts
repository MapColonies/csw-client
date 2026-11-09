import { mapKeys } from 'lodash';
import { IPycswKeyMapping } from './fieldRules/types';

/**
 * Renames a raw pycsw record's XML-element keys to their mapped domain property names.
 * Keys with no matching mapping are passed through unchanged.
 */
export function renamePycswKeys(record: Record<string, unknown>, pyCSWKeys: readonly IPycswKeyMapping[]): Record<string, unknown> {
  return mapKeys(record, (value, key) => pyCSWKeys.find((mapping) => mapping.xmlElement === key)?.prop ?? key);
}
