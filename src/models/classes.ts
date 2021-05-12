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
