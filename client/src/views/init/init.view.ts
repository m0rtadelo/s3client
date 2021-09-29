import { ConfigComponent } from '../../components/';
import { get, View } from '../../core';
import { InitController } from './init.controller';
import { INTERVAL } from '../../core/constants';
import { MainView } from '../main/main.view';
import { IBucket } from '../../interfaces/config.interface';
export class InitView extends View {
  private controller = new InitController();
  constructor(data?: any) {
    super('<config></config>', [new ConfigComponent()]);
  }

  public async onReady() {
    this.loading = true;
    const config = await this.controller.init();
    this.model.setConfig(config);
    get('title').innerText += ` (v.${this.model.getConfig().version })`;
    this.loading = false;
    if (this.model.hasBucket()) {
      this.emmit(this.model.buckets[0]);
    }
    setTimeout(() => {
      get('accessKeyId').focus();
    }, INTERVAL);
    (window as any).api.message(async (response) => {
      if (response.action === 'check') {
        console.log(response);
        if (response.end === true) {
          await this.controller.saveConfig(this.model.getConfig());
          new MainView(this.model);
          this.loading = false;
        } else if (response.error) {
          this.model.error = response.error || 'unknown error!';
          this.loading = false;
        }
      }
    });
  }

  public async emmit(data: IBucket) {
    this.loading = true;
    this.model.error = '';
    await this.controller.check(data);
  }
}
