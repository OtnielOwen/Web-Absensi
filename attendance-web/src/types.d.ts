export interface BaseResponse<T = BaseDataResponse | BaseDataResponse[]> {
  success: boolean;
  code: number;
  status: string;
  message: string;
  data: T;
  pagination?: PaginationResponse;
}

export interface BaseDataResponse {
  id: string;
  type: string;
  attributes: object;
}

export interface PaginationResponse {
  vars: {
    page: number;
    items: number;
    outset: number;
    size: number[];
    page_param: string;
    fragment: string;
    link_extra: string;
    i18n_key: string;
    cycle: boolean;
    steps: boolean;
    trim_extra: boolean;
    countless_minimal: boolean;
    count: number;
  };
  count: number;
  page: number;
  outset: number;
  items: number;
  last: number;
  pages: number;
  offset: number;
  from: number;
  to: number;
  in: number;
  prev?: number;
  next?: number;
}
