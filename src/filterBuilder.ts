/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS } from './defaults';

export class FilterBuilder {
  private tmp?: { PropertyName: string };

  public constructor() {
    // eslint-disable-next-line
    (this as any)['ogc:Filter'] = {
      TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.FilterType`,
    };
  }

  public PropertyName(propertyName: string): FilterBuilder {
    this.tmp = { PropertyName: propertyName };
    return this;
  }

  public isLike(value: string): FilterBuilder {
    // eslint-disable-next-line
    (this as any)['ogc:Filter'].comparisonOps = {
      'ogc:PropertyIsLike': {
        TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.PropertyIsLikeType`,
        escapeChar: '',
        singleChar: '_',
        wildCard: '%',
        literal: {
          TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.LiteralType`,
          content: [value],
        },
        propertyName: {
          TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.PropertyNameType`,
          content: [this.tmp?.PropertyName],
        },
      },
    };
    // Delete the tmp property to prevent jsonix fail.
    delete this.tmp;
    return this;
  }

  public isBetween(lowerValue: string, upperValue: string): FilterBuilder {
    // eslint-disable-next-line
    (this as any)['ogc:Filter'].comparisonOps = {
      'ogc:PropertyIsBetween': {
        TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.PropertyIsBetweenType`,
        expression: {
          'ogc:PropertyName': {
            TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.PropertyNameType`,
            content: [this.tmp?.PropertyName],
          },
        },
        lowerBoundary: {
          expression: {
            'ogc:Literal': {
              TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.LiteralType`,
              content: [lowerValue],
            },
          },
        },
        upperBoundary: {
          expression: {
            'ogc:Literal': {
              TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.LiteralType`,
              content: [upperValue],
            },
          },
        },
      },
    };
    // Delete the tmp property to prevent jsonix fail.
    delete this.tmp;
    return this;
  }

  public isEqualTo(value: string): FilterBuilder {
    // eslint-disable-next-line
    (this as any)['ogc:Filter'].comparisonOps = {
      'ogc:PropertyIsEqualTo': {
        TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.PropertyIsEqualTo`,
        matchCase: false,
        expression: [
          {
            'ogc:Literal': {
              TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.LiteralType`,
              content: [value],
            },
          },
          {
            'ogc:PropertyName': {
              TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.PropertyNameType`,
              content: [this.tmp?.PropertyName],
            },
          },
        ],
      },
    };
    // Delete the tmp property to prevent jsonix fail.
    delete this.tmp;
    return this;
  }

  public isLessThanOrEqualTo(value: string): FilterBuilder {
    // eslint-disable-next-line
    (this as any)['ogc:Filter'].comparisonOps = {
      'ogc:PropertyIsLessThanOrEqualTo': {
        TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.PropertyIsLessThanOrEqualTo`,
        expression: [
          {
            'ogc:Literal': {
              TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.LiteralType`,
              content: [value],
            },
          },
          {
            'ogc:PropertyName': {
              TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.PropertyNameType`,
              content: [this.tmp?.PropertyName],
            },
          },
        ],
      },
    };
    // Delete the tmp property to prevent jsonix fail.
    delete this.tmp;
    return this;
  }

  public isGreaterThan(value: string): FilterBuilder {
    // eslint-disable-next-line
    (this as any)['ogc:Filter'].comparisonOps = {
      'ogc:PropertyIsGreaterThan': {
        TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.PropertyIsGreaterThan`,
        expression: [
          {
            'ogc:Literal': {
              TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.LiteralType`,
              content: [value],
            },
          },
          {
            'ogc:PropertyName': {
              TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.PropertyNameType`,
              content: [this.tmp?.PropertyName],
            },
          },
        ],
      },
    };
    // Delete the tmp property to prevent jsonix fail.
    delete this.tmp;
    return this;
  }

  public isLessThan(value: string): FilterBuilder {
    // eslint-disable-next-line
    (this as any)['ogc:Filter'].comparisonOps = {
      'ogc:PropertyIsLessThan': {
        TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.PropertyIsLessThan`,
        expression: [
          {
            'ogc:Literal': {
              TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.LiteralType`,
              content: [value],
            },
          },
          {
            'ogc:PropertyName': {
              TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.PropertyNameType`,
              content: [this.tmp?.PropertyName],
            },
          },
        ],
      },
    };
    // Delete the tmp property to prevent jsonix fail.
    delete this.tmp;
    return this;
  }

  public isGreaterThanOrEqualTo(value: string): FilterBuilder {
    // eslint-disable-next-line
    (this as any)['ogc:Filter'].comparisonOps = {
      'ogc:PropertyIsGreaterThanOrEqualTo': {
        TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.PropertyIsGreaterThanOrEqualTo`,
        expression: [
          {
            'ogc:Literal': {
              TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.LiteralType`,
              content: [value],
            },
          },
          {
            'ogc:PropertyName': {
              TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.PropertyNameType`,
              content: [this.tmp?.PropertyName],
            },
          },
        ],
      },
    };
    // Delete the tmp property to prevent jsonix fail.
    delete this.tmp;
    return this;
  }

  public isNotEqualTo(value: string): FilterBuilder {
    // eslint-disable-next-line
    (this as any)['ogc:Filter'].comparisonOps = {
      'ogc:PropertyIsNotEqualTo': {
        TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.PropertyIsNotEqualTo`,
        expression: [
          {
            'ogc:Literal': {
              TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.LiteralType`,
              content: [value],
            },
          },
          {
            'ogc:PropertyName': {
              TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.PropertyNameType`,
              content: [this.tmp?.PropertyName],
            },
          },
        ],
      },
    };
    // Delete the tmp property to prevent jsonix fail.
    delete this.tmp;
    return this;
  }

  public and(filter: FilterBuilder | null): FilterBuilder {
    // eslint-disable-next-line
    const filterInstance: any = (this as any)['ogc:Filter'];
    if (filter === null) {
      return this;
    }

    if (typeof filterInstance.logicOps === 'undefined') {
      filterInstance.logicOps = {
        'ogc:And': {
          TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.BinaryLogicOpType`,
          //comparisonOpsOrSpatialOpsOrLogicOps: []
        },
      };
      /**
       *   TODO We need to check if the filter/operator is a
       *   GeometryOperands, SpatialOperators(spatialOps), ComparisonOperators
       *   (comparisonOps), ArithmeticOperators or is a composition of them
       *   "comparisonOpsOrSpatialOpsOrLogicOps" at the moment only supports
       *   Filter.isLike().and(Filter.isLike()) or SpatialOps (ex: BBOX);
       */
      if (typeof filterInstance.comparisonOps !== 'undefined') {
        // Only has one previous filter and it is a comparison operator.
        // Now is ops before was comparisonOpsOrSpatialOpsOrLogicOps
        filterInstance.logicOps['ogc:And'].ops = [filterInstance.comparisonOps].concat(filter.getPreviousOperator());
        delete filterInstance.comparisonOps;
      } else if (typeof filterInstance.spatialOps !== 'undefined') {
        // Only has one previous filter and it is a spatial operator.
        filterInstance.logicOps['ogc:And'].ops = [filterInstance.spatialOps].concat(filter.getPreviousOperator());
        delete filterInstance.spatialOps;
      } else {
        throw new Error('Not Implemented yet, another operators');
      }
    } else {
      // It has two or more previous operators. TODO They must be And Operator fix to accept 'ogc:Or'.
      // eslint-disable-next-line
      filterInstance.logicOps['ogc:And'].ops = filterInstance.logicOps['ogc:And'].ops.concat(filter.getPreviousOperator());
    }
    return this;
  }

  public or(filter: FilterBuilder | null): FilterBuilder {
    // eslint-disable-next-line
    const filterInstance: any = (this as any)['ogc:Filter'];
    if (filter === null) {
      return this;
    }

    if (typeof filterInstance.logicOps === 'undefined') {
      //console.debug('The first Or');
      filterInstance.logicOps = {
        'ogc:Or': {
          TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.BinaryLogicOpType`,
          //comparisonOpsOrSpatialOpsOrLogicOps: []
        },
      };
      /**
       *   TODO We need to check if the filter/operator is a
       *   GeometryOperands, SpatialOperators(spatialOps), ComparisonOperators
       *   (comparisonOps), ArithmeticOperators or is a composition of them
       *   "comparisonOpsOrSpatialOpsOrLogicOps" at the moment only supports
       *   Filter.isLike().and(Filter.isLike()) or SpatialOps (ex: BBOX);
       */
      if (typeof filterInstance.comparisonOps !== 'undefined') {
        // Only has one previous filter and it is a comparison operator.
        filterInstance.logicOps['ogc:Or'].ops = [filterInstance.comparisonOps].concat(filter.getPreviousOperator());
        delete filterInstance.comparisonOps;
      } else if (typeof filterInstance.spatialOps !== 'undefined') {
        // Only has one previous filter and it is a spatial operator.
        filterInstance.logicOps['ogc:Or'].ops = [filterInstance.spatialOps].concat(filter.getPreviousOperator());
        delete filterInstance.spatialOps;
      } else {
        throw new Error('Not Implemented yet, another operators');
      }
    } else {
      // It has two or more previous operators. TODO They must be And Operator fix to accept 'ogc:And'.
      // eslint-disable-next-line
      filterInstance.logicOps['ogc:Or'].ops = filterInstance.logicOps['ogc:Or'].ops.concat(filter.getPreviousOperator());
    }
    return this;
  }

  public BBOX(llat: number, llon: number, ulat: number, ulon: number, srsName?: string): FilterBuilder {
    // eslint-disable-next-line
    (this as any)['ogc:Filter'].spatialOps = {
      'ogc:BBOX': {
        TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.BBOXType`,
        envelope: {
          'gml:Envelope': {
            TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.GML}.EnvelopeType`,
            lowerCorner: {
              TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.GML}.DirectPositionType`,
              value: [llat, llon],
            },
            upperCorner: {
              TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.GML}.DirectPositionType`,
              value: [ulat, ulon],
            },
            // srsName: srsName
          },
        },
        propertyName: {
          TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.PropertyNameType`,
          content: 'ows:BoundingBox',
        },
      },
    };
    delete this.tmp;
    return this;
  }

  // public not(filter: FilterBuilder): void {
  //   throw new Error('Not Implemented yet');
  // }

  // public isNull(value: string): void {
  //   throw new Error('Not Implemented yet');
  // }

  /* eslint-disable */
  private getPreviousOperator(): any {
    let operator;
    const filter = this as any;
    if (typeof filter['ogc:Filter'].comparisonOps !== 'undefined') {
      // Only has one previous filter and it is a comparison operator.
      operator = filter['ogc:Filter'].comparisonOps;
    } else if (typeof filter['ogc:Filter'].spatialOps !== 'undefined') {
      // Only has one previous filter and it is a spatial operator.
      operator = filter['ogc:Filter'].spatialOps;
    } else if (typeof filter['ogc:Filter'].logicOps !== 'undefined') {
      operator = filter['ogc:Filter'].logicOps;
    } else {
      throw new Error('Not Implemented yet, another operators');
    }
    return operator;
  }
  /* eslint-enable */
}
