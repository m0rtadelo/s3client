import { Service } from './service';
import { expect } from 'chai';

describe('Service', () => {
  it('should return error by default', async () => {
    const service = new Service();
    expect(JSON.stringify(await service.query({}))).equals(JSON.stringify({ status: 500 }));
  });
});
