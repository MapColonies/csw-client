import { SortBuilder } from '../../src/sortBuilder';

describe('SortBuilder related', () => {
  it('Creation sort', () => {
    const sort: SortBuilder = new SortBuilder().Sort('dc:title');
    // eslint-disable-next-line
    expect((sort as any)['ogc:SortBy'].sortProperty).toHaveLength(1);
  });

  it('TWO sort', () => {
    const sort: SortBuilder = new SortBuilder().Sort('dc:title');
    sort.Sort('dc:dummy', true);
    // eslint-disable-next-line
    expect((sort as any)['ogc:SortBy'].sortProperty).toHaveLength(2);
  });
});
