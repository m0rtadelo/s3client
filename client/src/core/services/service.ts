import { IResponse } from '../interfaces/response.interface';
import { IService } from '../interfaces/service.interface';

export class Service implements IService {
  async query(data: any): Promise<IResponse> {
    return await { status: 500 };
  }
}
