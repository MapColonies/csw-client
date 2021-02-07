export interface ICSWConfig {
  shemas: any[];
  nameSpaces: {
    namespacePrefixes: { [key: string]: string };
    mappingStyle?: string;
  };
  credentials?: {};
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
  (url: string, method: string, params: Record<string, unknown>): Promise<any>;
}

export interface ICapabilities {
  serviceIdentification: any;
  serviceProvider: any;
  operationsMetadata: any;
  filterCapabilities: any;
}
