import { RecordType } from '@map-colonies/types';
import { transformRecordsToEntity } from '../../../src/adapters/transformRecordsToEntity';
import { mcCswFieldRules } from '../../../src/adapters/fieldRules/mcCsw';
import { extendFieldRules } from '../../../src/adapters/fieldRules/compose';
import { renamePycswKeys } from '../../../src/adapters/keyMapper';
import { toLinkModel } from '../../../src/adapters/links';

const PY_CSW_KEYS = [
  { xmlElement: 'mc:id', prop: 'id', profile: 'mc_raster', queryableField: 'mc:id' },
  { xmlElement: 'mc:type', prop: 'type', profile: 'mc_raster', queryableField: 'mc:type' },
  { xmlElement: 'mc:footprint', prop: 'footprint', profile: 'mc_raster', queryableField: 'mc:footprint' },
  { xmlElement: 'mc:creationDate', prop: 'creationDate', profile: 'mc_raster', queryableField: 'mc:creationDate' },
  { xmlElement: 'mc:hasTerrain', prop: 'hasTerrain', profile: 'mc_raster', queryableField: 'mc:hasTerrain' },
  { xmlElement: 'mc:keywords', prop: 'keywords', profile: 'mc_raster', queryableField: 'mc:keywords' },
  { xmlElement: 'mc:links', prop: 'links', profile: 'mc_raster', queryableField: 'mc:links' },
  { xmlElement: 'mc:layerPolygonParts', prop: 'layerPolygonParts', profile: 'mc_raster', queryableField: 'mc:layerPolygonParts' },
  { xmlElement: 'mc:discretes', prop: 'discretes', profile: 'mc_raster', queryableField: 'mc:discretes' },
  { xmlElement: 'mc:productVersion', prop: 'productVersion', profile: 'mc_raster', queryableField: 'mc:productVersion' },
];

describe('transformRecordsToEntity', () => {
  it('renames xml-element keys to their mapped prop names', () => {
    const [record] = transformRecordsToEntity<Record<string, unknown>>(
      [{ 'mc:id': '1', 'mc:type': RecordType.RECORD_RASTER, unmapped: 'kept' }],
      PY_CSW_KEYS,
      mcCswFieldRules
    );

    expect(record).toMatchObject({ id: '1', type: RecordType.RECORD_RASTER, unmapped: 'kept' });
  });

  it('JSON-parses the footprint field', () => {
    const [record] = transformRecordsToEntity<Record<string, unknown>>(
      [{ 'mc:type': RecordType.RECORD_RASTER, 'mc:footprint': '{"type":"Polygon"}' }],
      PY_CSW_KEYS,
      mcCswFieldRules
    );

    expect(record.footprint).toEqual({ type: 'Polygon' });
  });

  it('casts date fields to Date instances', () => {
    const [record] = transformRecordsToEntity<Record<string, unknown>>(
      [{ 'mc:type': RecordType.RECORD_RASTER, 'mc:creationDate': '2020-01-01T00:00:00.000Z' }],
      PY_CSW_KEYS,
      mcCswFieldRules
    );

    expect(record.creationDate).toEqual(new Date('2020-01-01T00:00:00.000Z'));
  });

  it('maps python-style booleans to JS booleans', () => {
    const [record] = transformRecordsToEntity<Record<string, unknown>>(
      [{ 'mc:type': RecordType.RECORD_RASTER, 'mc:hasTerrain': 'True' }],
      PY_CSW_KEYS,
      mcCswFieldRules
    );

    expect(record.hasTerrain).toBe(true);
  });

  it('builds link models from raw pycsw link elements', () => {
    const [record] = transformRecordsToEntity<Record<string, unknown>>(
      [
        {
          'mc:type': RecordType.RECORD_RASTER,
          'mc:links': { $: { scheme: 'WMS', name: 'n', description: 'd' }, _: 'http://example.com' },
        },
      ],
      PY_CSW_KEYS,
      mcCswFieldRules
    );

    expect(record.links).toEqual([{ protocol: 'WMS', name: 'n', description: 'd', url: 'http://example.com' }]);
  });

  it('only JSON-parses layerPolygonParts for raster/DEM records', () => {
    const [rasterRecord] = transformRecordsToEntity<Record<string, unknown>>(
      [{ 'mc:type': RecordType.RECORD_RASTER, 'mc:layerPolygonParts': '{"a":1}' }],
      PY_CSW_KEYS,
      mcCswFieldRules
    );
    const [threeDRecord] = transformRecordsToEntity<Record<string, unknown>>(
      [{ 'mc:type': RecordType.RECORD_3D, 'mc:layerPolygonParts': '{"a":1}' }],
      PY_CSW_KEYS,
      mcCswFieldRules
    );

    expect(rasterRecord.layerPolygonParts).toEqual({ a: 1 });
    expect(threeDRecord.layerPolygonParts).toEqual({});
  });

  it('only JSON-parses discretes for raster records', () => {
    const [rasterRecord] = transformRecordsToEntity<Record<string, unknown>>(
      [{ 'mc:type': RecordType.RECORD_RASTER, 'mc:discretes': '[1,2]' }],
      PY_CSW_KEYS,
      mcCswFieldRules
    );
    const [demRecord] = transformRecordsToEntity<Record<string, unknown>>(
      [{ 'mc:type': RecordType.RECORD_DEM, 'mc:discretes': '[1,2]' }],
      PY_CSW_KEYS,
      mcCswFieldRules
    );

    expect(rasterRecord.discretes).toEqual([1, 2]);
    expect(demRecord.discretes).toBeUndefined();
  });

  it('stringifies productVersion only for 3D records', () => {
    const [threeDRecord] = transformRecordsToEntity<Record<string, unknown>>(
      [{ 'mc:type': RecordType.RECORD_3D, 'mc:productVersion': 1.5 }],
      PY_CSW_KEYS,
      mcCswFieldRules
    );
    const [rasterRecord] = transformRecordsToEntity<Record<string, unknown>>(
      [{ 'mc:type': RecordType.RECORD_RASTER, 'mc:productVersion': 1.5 }],
      PY_CSW_KEYS,
      mcCswFieldRules
    );

    expect(threeDRecord.productVersion).toBe('1.5');
    expect(rasterRecord.productVersion).toBe(1.5);
  });

  it('allows overriding field rules without forking the base ruleset', () => {
    const customRules = extendFieldRules(mcCswFieldRules, { isBoolean: (fieldName) => fieldName === 'customFlag' });
    const [record] = transformRecordsToEntity<Record<string, unknown>>(
      [{ 'mc:type': RecordType.RECORD_RASTER, 'mc:hasTerrain': 'True', customFlag: 'False' }],
      PY_CSW_KEYS,
      customRules
    );

    expect(record.hasTerrain).toBe('True');
    expect(record.customFlag).toBe(false);
  });
});

describe('renamePycswKeys', () => {
  it('passes through keys with no mapping', () => {
    const result = renamePycswKeys({ unmapped: 'value' }, PY_CSW_KEYS);
    expect(result).toEqual({ unmapped: 'value' });
  });
});

describe('toLinkModel', () => {
  it('reads protocol/name/description/url off the xml2js link shape', () => {
    expect(toLinkModel({ $: { scheme: 'WMS', name: 'n', description: 'd' }, _: 'http://example.com' })).toEqual({
      protocol: 'WMS',
      name: 'n',
      description: 'd',
      url: 'http://example.com',
    });
  });
});
