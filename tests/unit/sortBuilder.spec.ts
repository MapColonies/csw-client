import { SortBuilder } from '../../src';

describe('SortBuilder related', () => {
  it('Creation sort', () => {
    const sort: any = new SortBuilder().Sort('dc:title');

    expect(sort['ogc:SortBy'].sortProperty.length).toBe(1);
  });

  it('TWO sort', () => {
    const sort: any = new SortBuilder().Sort('dc:title');
    sort.Sort('dc:dummy', true);
    expect(sort['ogc:SortBy'].sortProperty.length).toBe(2);
  });
});