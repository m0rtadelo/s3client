import { IResponse } from './response.interface';

export interface IService {
  query: (data: any) => Promise<IResponse>;
}
