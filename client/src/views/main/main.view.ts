import { FileExplorerComponent, MainMenuComponent } from '../../components';
import { TasksComponent } from '../../components/tasks/tasks.component';
import { View } from '../../core';
import { IBucket } from '../../interfaces/config.interface';
import { Model } from '../../model';
import { MainController } from './main.controller';
import { HTML } from './main.html';

export class MainView extends View {
  public controller = new MainController(this);
  public bucket: IBucket;

  constructor(data: Model) {
    super(HTML, [
      new FileExplorerComponent(),
      new MainMenuComponent(),
      new TasksComponent(),
    ], data);
    this.bucket = data.buckets[0];
    (window as any).api.message(async (response) => {
      this.checkResponse(response);
    });
  }

  public onReady() {
    this.loadContent();
  }

  public reloadRemote() {
    this.model.selectedFiles.remote = [];
    this.model.remoteFiles = [];
    this.model.remoteRaw.forEach((item) => {
      if (!item.Key.startsWith('/')) {
        item.Key = '/'.concat(item.Key);
      }
      const valid = item.Key.toString().startsWith(this.bucket.remotePath);
      const temp = item.Key.substr(this.bucket.remotePath.length + 0);
      const parts = ('/' + temp).split('/');
      if (valid) {
        if (parts.length > 2) {
          const exist = this.model.remoteFiles.find((exist) => exist.Key === parts[1]);
          if (!exist) {
            this.model.remoteFiles.push({
              Key: parts[1],
              isDirectory: true,
              Size: 0,
            });
          }
        } else {
          this.model.remoteFiles.push({ Key: temp, Size: item.Size });
        }
      }
    });
    this.model.remoteFiles = this.model.remoteFiles.sort((one, two) => (one.Key < two.Key ? -1 : 1));
    (this.getComponentById('remote') as FileExplorerComponent).unselectAll('remote');
    (this.getComponentById('remote') as FileExplorerComponent).loading = false;
  }

  public emmit(data: string) {
    const map = {
      'copy': () => this.controller.copyItems(),
      'delete': () => this.controller.deleteItems(),
      'reloadRemote': () => this.reloadRemote(),
      'reloadLocal': () => this.controller.loadLocal(),
    };
    map[data]?.();
  }
  
  private loadContent() {
    this.controller.loadLocal();
    this.controller.loadRemote();
  }
  
  private checkResponse(response) {
    if (response?.error) {
      this.notifyError(response.error);
    }
    if (response?.action === 'copyItems') {
      this.controller.updateItem(response);
    }
    if (response?.action === 'deleteItems') {
      this.controller.updateItem(response);
    }
    if (response?.action === 'loadRemote') {
      if (response.data) {
        this.model.remoteRaw = [...this.model.remoteRaw, ...response.data.Contents];
      }
      if (response.end) {
        this.reloadRemote();
      }
    }
    if (response?.action === 'loadLocal') {
      if (response.data) {
        if (response.data.error) {
          this.notifyError(response.data.error);
        } else {
          this.model.localFiles = response.data.map((e) => (
            { Key: e.name, Size: e.stats?.size, LastModified: e.stats?.mtime, isDirectory: e.isDirectory }
          ));
          this.model.localFiles = this.model.localFiles.sort((one, two) => (one.Key < two.Key ? -1 : 1));
        }
        (this.getComponentById('local') as FileExplorerComponent).unselectAll('local');
        (this.getComponentById('local') as FileExplorerComponent).loading = false;
      }
    }
  }
}
