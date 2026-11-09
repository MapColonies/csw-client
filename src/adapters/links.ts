import { get } from 'lodash';

export interface ILinkModel {
  protocol?: string;
  name?: string;
  description?: string;
  url?: string;
}

/**
 * Converts a single raw pycsw link element (xml2js shape: `{ $: {...attrs}, _: textContent }`)
 * into a flat link model.
 */
export function toLinkModel(raw: unknown): ILinkModel {
  return {
    protocol: get(raw, '$.scheme') as string,
    name: get(raw, '$.name') as string,
    description: get(raw, '$.description') as string,
    url: get(raw, '_') as string,
  };
}

/**
 * Converts a raw pycsw links value, which may be a single element or an array,
 * into a list of link models.
 */
export function toLinkModels(val: unknown): ILinkModel[] {
  const linksArr = Array.isArray(val) ? val : [val];
  return linksArr.map(toLinkModel);
}
