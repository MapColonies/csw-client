import { DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS } from './defaults';

export class FilterBuilder {
  private tmp?: { PropertyName: string };

  constructor() {
    (this as any)['ogc:Filter'] = {
      TYPE_NAME: `${DEFAULT_MAPPED_SCHEMA_VERSIONS_OBJECTS.FILTER}.FilterType`,
    };
  }

  PropertyName(propertyName: string) {
    this.tmp = { PropertyName: propertyName };
    return this;
  }

  isLike(value: any) {
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

  isNull(value: any) {
    throw 'Not Implemented yet';
  }

  isBetween(lowerValue: any, upperValue: any) {
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

  isEqualTo(value: any) {
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

  isLessThanOrEqualTo(value: any) {
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

  isGreaterThan(value: any) {
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

  isLessThan(value: any) {
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

  isGreaterThanOrEqualTo(value: any) {
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

  isNotEqualTo(value: any) {
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

  and(filter: any) {
    const filterInstance: any = (this as any)['ogc:Filter'];
    if (typeof filterInstance.logicOps === 'undefined') {
      //console.debug('The first And');
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
        filterInstance.logicOps['ogc:And'].ops = [filterInstance.comparisonOps].concat(filter._getPreviousOperator());
        delete filterInstance.comparisonOps;
      } else if (typeof filterInstance.spatialOps !== 'undefined') {
        // Only has one previous filter and it is a spatial operator.
        filterInstance.logicOps['ogc:And'].ops = [filterInstance.spatialOps].concat(filter._getPreviousOperator());
        delete filterInstance.spatialOps;
      } else {
        throw 'Not Implemented yet, another operators';
      }
    } else {
      // It has two or more previous operators. TODO They must be And Operator fix to accept 'ogc:Or'.
      filterInstance.logicOps['ogc:And'].ops = filterInstance.logicOps['ogc:And'].ops.concat(filter._getPreviousOperator());
    }
    return this;
  }

  or(filter: any) {
    const filterInstance: any = (this as any)['ogc:Filter'];
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
        filterInstance.logicOps['ogc:Or'].ops = [filterInstance.comparisonOps].concat(filter._getPreviousOperator());
        delete filterInstance.comparisonOps;
      } else if (typeof filterInstance.spatialOps !== 'undefined') {
        // Only has one previous filter and it is a spatial operator.
        filterInstance.logicOps['ogc:Or'].ops = [filterInstance.spatialOps].concat(filter._getPreviousOperator());
        delete filterInstance.spatialOps;
      } else {
        throw 'Not Implemented yet, another operators';
      }
    } else {
      // It has two or more previous operators. TODO They must be And Operator fix to accept 'ogc:And'.
      filterInstance.logicOps['ogc:Or'].ops = filterInstance.logicOps['ogc:Or'].ops.concat(filter._getPreviousOperator());
    }
    return this;
  }

  not(filter: any) {
    throw 'Not Implemented yet';
  }

  BBOX(llat: number, llon: number, ulat: number, ulon: number, srsName?: string) {
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

  private _getPreviousOperator() {
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
      console.error(filter);
      throw 'Not Implemented yet, another operators';
    }
    return operator;
  }
}
