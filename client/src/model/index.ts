import { IBucket, IConfig } from '../interfaces/config.interface';
import { IFiles, ISelectedFiles, ITask } from '../interfaces/model.interface';

export class Model {
  private config: IConfig;
  public error = '';
  public localFiles: Array<IFiles> = [];
  public remoteFiles: Array<IFiles> = [];
  public remoteRaw: any = [];
  public selectedFiles: ISelectedFiles = {
    local: [],
    remote: [],
  }
  public tasks: any = []

  public addTask(task: ITask) {
    const getId = (task: ITask) => task.action.concat('/').concat(task.process).concat('/').concat(task.item.Key);
    const chkTask = (task: ITask) => {
      if (task.end) {
        if (!task.progress) {
          task.progress = {
            current: 100,
            total: 100,
          };
        }
        setTimeout(() => {
          this.tasks = this.tasks.filter((t) => t.id !== task?.id);
        }, 5000);
      }
    };
    const existent:ITask = this.tasks.find((t) => t.id === getId(task));
    if (existent) {
      existent.end = task.end;
      chkTask(existent);
      existent.progress = task.progress || existent.progress;
      console.log('updateTask', existent);
    } else {
      task.id = getId(task);
      chkTask(task);
      console.log('addTask', task);
      this.tasks.push(task);
    }
  }

  public switchSelected(item: IFiles, type: string) {
    const exist = this.selectedFiles[type].includes(item);
    if (exist) {
      this.selectedFiles[type] = this.selectedFiles[type]
          .filter((elem: IFiles) => item.Key !== elem.Key);
    } else {
      this.selectedFiles[type].push(item);
    }
  }

  public countFiles(type: string): number {
    return type === 'local' ? this.localFiles.length : this.remoteFiles.length;
  }

  public countSelectedFiles(type: string): number {
    return this.selectedFiles[type].length;
  }

  public hasSelectedItems(): boolean {
    return (this.countSelectedFiles('local')) + (this.countSelectedFiles('remote')) > 0;
  }

  public getItem(key: string, type: string) : IFiles {
    return type === 'local' ?
      this.localFiles.find((i) => i.Key === key) :
      this.remoteFiles.find((i) => i.Key === key);
  }

  public get buckets(): Array<IBucket> {
    return this.config?.buckets;
  }
  public hasBucket() {
    return this.config && this.config?.buckets?.length && this.config?.buckets[0]?.accessKeyId?.length;
  }

  public setConfig(data: IConfig) {
    this.config = data;
  }

  public getConfig() {
    return this.config;
  }
}
