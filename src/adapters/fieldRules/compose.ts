import { FieldTypeRules } from './types';

/**
 * Builds a new FieldTypeRules from a base ruleset plus consumer-specific overrides,
 * without forking the base ruleset.
 */
export function extendFieldRules(base: FieldTypeRules, overrides: Partial<FieldTypeRules>): FieldTypeRules {
  return { ...base, ...overrides };
}
