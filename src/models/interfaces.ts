export interface ICSWConfig {
  schemas: Record<string, unknown>[];
  nameSpaces: {
    namespacePrefixes: { [key: string]: string };
    mappingStyle?: string;
  };
  credentials?: Record<string, unknown>;
}

export abstract class BBOX {
  abstract llat: number;
  abstract llon: number;
  abstract ulat: number;
  abstract ulon: number;
}

export abstract class FilterField {
  abstract or?: boolean;
  abstract field: string;
  abstract like?: string;
  abstract eq?: string;
  abstract neq?: string;
  abstract gt?: string;
  abstract lt?: string;
  abstract gteq?: string;
  abstract lteq?: string;
  abstract in?: [string, string];
  abstract bbox?: BBOX;
}

export abstract class SortField {
  abstract field: string;
  abstract desc?: boolean;
}

export interface IRequestExecutor {
  // eslint-disable-next-line
  (url: string, method: string, params: Record<string, unknown>): Promise<any>;
}

export interface IResponse {
  // eslint-disable-next-line
  data: any;
}

export interface ICapabilities {
  serviceIdentification: Record<string, unknown> | null;
  serviceProvider: Record<string, unknown> | null;
  operationsMetadata: Record<string, unknown> | null;
  filterCapabilities: Record<string, unknown> | null;
}
