import { Component, get, View } from '../../core';
import { IFiles } from '../../interfaces/model.interface';

export class FileExplorerComponent extends Component {
  public selector = 'file-explorer';
  public loading = false;
  private path: string;

  public render(view: View, parent: any) {
    super.render(view, parent);
    this.path = view.model.getConfig().path;
    super.return(this.listItems());
  }

  private listItems() {
    const map = {
      'local': () => this.table(this.getData().localFiles, (this.view as any)?.bucket?.localPath, 'local'),
      'remote': () => this.table(this.getData().remoteFiles, (this.view as any)?.bucket?.remotePath, 'remote'),
    };
    return map[this.getAttribute('id')]?.();
  }

  private getReadableFileSizeString(fileSizeInBytes) {
    let i = -1;
    const byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
      fileSizeInBytes = fileSizeInBytes / 1024;
      i++;
    } while (fileSizeInBytes > 1024);

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
  };

  private getItem(item: IFiles, type: string) {
    return `<tr><td>
    <input class="form-check-input" type="checkbox" value=""
    click="this.switch('${item.Key}', '${type}')" id="${type + '/' + item.Key}"> 
    ${ item.isDirectory ?
      `<a href="#" click="${type === 'local' ?
      `this.openLocalFolder('${item.Key}')` : `this.openRemoteFolder('${item.Key}');`}">
        <i class="bi bi-folder"></i> ${item.Key}
      </a>` :
      `<i class="bi bi-file-text"></i> ${item.Key.trim()}` }
    </td><td class="text-end">${this.getReadableFileSizeString(item.Size)}</td></tr>`;
  }

  private switch(key: string, type: string) {
    const item = this.view.model.getItem(key, type);
    this.view.model.switchSelected(item, type);
  }

  private table(items, path, type) {
    let result = `
    <style>
    file-explorer a {
      text-decoration: none;
      color: #212529;
    }
    file-explorer a:hover {
      color: blue;
    }
    </style>
    <div class="form-row">
    <form onsubmit="return false;" submit="this.goTo('${type}')">
    <div class="input-group input-group-sm mb-3">
      <span class="input-group-text" id="basic-addon1">${ type === 'local' ? 'file://' : 's3://' }</span>
      <input type="text" id="inp${type}" class="form-control" aria-describedby="basic-addon1" value="${path}">
      <button class="btn btn-outline-secondary" type="submit" id="button-addon2">
        <i class="bi bi-arrow-repeat"></i>
      </button>
    </div>
    </form>
      <!--<input type="text" class="form-control col-12" value="${path}">-->
    </div>`;
    if (this.loading) {
      return result;
    //    + `<div class="center-screen"><div class="spinner-border m-5" role="status">
    //   <span class="visually-hidden">Loading...</span>
    // </div></div>`;
    }
    result += `
    <div style="width: 50%; position: absolute; overflow-y: auto; top: 6em; bottom: 8em; border-left: 1px solid #ccc;">
    <table class="table table-sm table-striped table-hover">
    <tbody style="font-size: small;">`;
    if ((this.path === '/' && path?.length > 1) || (this.path === '\\' && path?.length > 3)) {
      result += `
      <tr><td>
        <input class="form-check-input" type="checkbox" value="" disabled>
        <a href="#" click="${type === 'local' ? `this.openLocalFolder('..')` : `this.openRemoteFolder('..')`}"> 
        <i class="bi bi-folder"></i> ..</a></td><td>&nbsp;
      </td></tr>`;
    }
    [true, false].forEach((isDir) => {
      items.forEach((item) => {
        if (!!item?.isDirectory == isDir) {
          result += this.getItem(item, type);
        }
      });
    });
    return result.concat(`</tbody>
    </table></div>
    <div style="position: absolute; bottom: 6em; height: 2em; width: 50%; border-left: 1px solid #ccc;"
    class="text-center">
    <a href="#" click="this.unselectAll('${type}')"><i class="bi bi-list-task" title="Unselect all items"></i></a>
    <small>
    <span class="badge bg-secondary"> ${this.view.model.countFiles(type)} Items </span>
    </small>
    <a href="#" click="this.selectAll('${type}')"><i class="bi bi-list-check" title="Select all items"></i></a>
    </div>
  `);
  }

  private goTo(type: string) {
    const elem = get(`inp${type}`);
    (this.view as any)?.controller[type === 'local' ? 'loadLocal' : 'loadRemote']?.(elem.value);
  }

  public selectAll(type: string) {
    this.view.model[type === 'local' ? 'localFiles' : 'remoteFiles'].forEach((file: IFiles) => {
      const chk = get(type + '/' + file.Key);
      if (chk && !chk.checked) {
        chk.click();
      }
    });
  }

  public unselectAll(type: string) {
    this.view.model[type === 'local' ? 'localFiles' : 'remoteFiles'].forEach((file: IFiles) => {
      const chk = get(type + '/' + file.Key);
      if (chk && chk.checked) {
        chk.click();
      }
    });
  }

  private removeLastPath(path) {
    let parts = path.split(this.path);
    if (this.path === '/' || path.startsWith('/')) {
      parts = path.split('/');
      let newPath = '/';
      for (let i=1; i < parts.length - 2; i++) {
        newPath += parts[i] + '/';
      }
      return newPath;
    } else {
      if (parts[parts.length -1] === '') {
        parts = parts.slice(0, parts.length - 1);
      }
      return parts.slice(0, parts.length -1 ).join(this.path).concat(this.path);
    }
  }

  private openLocalFolder(folder: string) {
    if (folder === '..') {
      (this.view as any).bucket.localPath = this.removeLastPath((this.view as any)?.bucket?.localPath);
    } else {
      (this.view as any).bucket.localPath = (this.view as any)?.bucket?.localPath?.concat(folder).concat(this.path);
    }
    this.view.emmit('reloadLocal');
  }
  private openRemoteFolder(folder: string) {
    if (folder === '..') {
      (this.view as any).bucket.remotePath = this.removeLastPath((this.view as any)?.bucket?.remotePath);
    } else {
      const ap = (this.view as any)?.bucket?.remotePath;
      const np = ap.concat(folder).concat('/');
      (this.view as any).bucket.remotePath = np;
    }
    this.view.emmit('reloadRemote');
  }
}
