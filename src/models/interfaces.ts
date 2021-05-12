export interface ICSWConfig {
  shemas: Record<string, unknown>[];
  nameSpaces: {
    namespacePrefixes: { [key: string]: string };
    mappingStyle?: string;
  };
  credentials?: Record<string, unknown>;
}

export interface IFilterField {
  or?: boolean;
  field: string;
  like?: string;
  eq?: string;
  neq?: string;
  gt?: string;
  lt?: string;
  gteq?: string;
  lteq?: string;
  in?: [string, string];
  bbox?: {
    llat: number;
    llon: number;
    ulat: number;
    ulon: number;
  };
}

export interface ISortField {
  field: string;
  desc?: boolean;
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
