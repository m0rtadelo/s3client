import { FileExplorerComponent } from '../../components';
import { ITask } from '../../interfaces/model.interface';
import { MainView } from './main.view';

export class MainController {
  view: MainView;

  constructor(view?: MainView) {
    this.view = view;
  }

  public loadLocal(path?: string) {
    (this.view.getComponentById('local') as FileExplorerComponent).loading = true;
    this.view.bucket.localPath = this.fixPath(path) || this.view.bucket.localPath;
    this.view.model.localFiles = [];
    this.view.model.selectedFiles.local = [];
    (window as any).api.sendMessage({ action: 'loadLocal', bucket: this.view.bucket });
  }

  public loadRemote(path?: string) {
    (this.view.getComponentById('remote') as FileExplorerComponent).loading = true;
    this.view.bucket.remotePath = this.fixPath(path) || this.view.bucket.remotePath;
    this.view.model.remoteFiles = [];
    this.view.model.remoteRaw = [];
    this.view.model.selectedFiles.remote = [];
    (window as any).api.sendMessage({ action: 'loadRemote', bucket: this.view.bucket });
  }

  public copyItems() {
    (window as any).api.sendMessage(
        { action: 'copyItems', bucket: this.view.bucket, data: this.view.model.selectedFiles },
    );
    this.loadLocal();
    this.loadRemote();
  }

  public async deleteItems() {
    if (await this.view.modal.confirm('Are you sure you want to delete this items?', 'Delete confirmation')) {
      (window as any).api.sendMessage(
          { action: 'deleteItems', bucket: this.view.bucket, data: this.view.model.selectedFiles },
      );
      this.loadLocal();
      this.loadRemote();
    }
  }

  public updateItem(item: ITask) {
    this.view.model.addTask(item);
  }
  private fixPath(path: string): string {
    return path?.startsWith('/') ? path?.endsWith('/') ? path : path?.concat('/') : path;
  }
}
