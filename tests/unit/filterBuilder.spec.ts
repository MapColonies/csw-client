import { reduce, isObject, findIndex } from 'lodash';
import { FilterBuilder } from '../../src/filterBuilder';

/* eslint-disable */
describe('FilterBuilder related', () => {
  it('Creation Filter Test', () => {
    const filter: any = new FilterBuilder().PropertyName('dc:title').isLike('%water%');

    expect(filter['ogc:Filter'].comparisonOps['ogc:PropertyIsLike'].literal.content[0]).toBe('%water%');
    expect(filter['ogc:Filter'].comparisonOps['ogc:PropertyIsLike'].propertyName.content).toStrictEqual(['dc:title']);
  });

  it('TWO isLike in "and" filters', () => {
    let filter: any = new FilterBuilder().PropertyName('dc:title').isLike('%water%');
    filter = filter.and(new FilterBuilder().PropertyName('dc:subject').isLike('%polution%'));

    const andFilters = reduce(
      filter['ogc:Filter'].logicOps['ogc:And'].ops,
      (count, item: any) => {
        return isObject(item['ogc:PropertyIsLike']) ? count + 1 : count;
      },
      0
    );

    expect(filter['ogc:Filter'].logicOps['ogc:And'].ops).toHaveLength(andFilters);
  });

  it('isLike and BBOX Filter', () => {
    let filter: any = new FilterBuilder().PropertyName('dc:title').isLike('%water%');
    filter = filter.and(new FilterBuilder().BBOX(-80, 150, 80, -150));

    const propLikeIdx = findIndex(filter['ogc:Filter'].logicOps['ogc:And'].ops, (item: any) => isObject(item['ogc:PropertyIsLike']));
    const propBBOXIdx = findIndex(filter['ogc:Filter'].logicOps['ogc:And'].ops, (item: any) => isObject(item['ogc:BBOX']));

    expect(filter['ogc:Filter'].logicOps['ogc:And'].ops).toHaveLength(2);
    expect(propBBOXIdx).toBeGreaterThanOrEqual(0);
    expect(propLikeIdx).toBeGreaterThanOrEqual(0);
  });
});
/* eslint-enable */
