import { IBucket, IConfig } from '../../interfaces/config.interface';

export class InitController {
  public async init() {
    return await (window as any).api.init();
  }

  public async saveConfig(data: IConfig) {
    return await (window as any).api.saveConfig(data);
  }

  public async check(data: IBucket) {
    return await (window as any).api.sendMessage({ action: 'check', data });
  }
}
