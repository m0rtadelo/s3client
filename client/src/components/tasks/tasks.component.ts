import { Component, View } from '../../core';
import { ITask } from '../../interfaces/model.interface';

export class TasksComponent extends Component {
  public selector = 'tasks';

  public render(view: View, parent: any) {
    super.render(view, parent);
    super.return(this.getHTML(view));
  }

  private getHTML(view: View) {
    const map = {
      'download': 'bi-arrow-left-square',
      'upload': 'bi-arrow-right-square',
    };
    const getPerc = (current: number, total: number) => {
      return (((+current || 0) / (+total || 0)) * 100).toFixed(0);
    };
    let response = '<div class="container-fluid">';
    this.view.model.tasks.forEach((task:ITask) => {
      const perc = getPerc(task.progress?.current, task.progress?.total);
      response += `
      <div style="width:100%; background-color: #ebeced; border-radius: 0.4em; margin: 0.1em;" class="row">
      <div class="col" style="font-size: small;">
      <i class="bi ${map[task.process] || 'bi-trash'}"></i> <i class="bi ${task.item.isDirectory ? 'bi-folder' : 'bi-file-text'}"></i> ${task.item.Key}
        </div>
        <div class="col">
        <div class="progress" style="height: 0.6em; margin: 0.5em;">
        <div class="progress-bar ${+perc === 100 ? 'bg-success' : ''}" role="progressbar" style="width: ${perc}%;" aria-valuenow="${task.progress?.current || 0}" aria-valuemin="0" aria-valuemax="${task.progress?.total || 0}"></div>
      </div>          
        </div>
      </div>
      `;
    });
    return response.concat('</div>');
  }
}
