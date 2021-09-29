import { View } from '../../core';
import { Component } from '../../core';
import { exportExcel } from '../../core/utils/export';
import { i18n } from '../../core/services/i18';

export class TableDateComponent extends Component {
  public selector = 'table-data';
  public labelAdd: string;
  private headers: string[];

  constructor() {
    super();
  }

  public render(view: View, parent: any, dataToUse?: string) {
    super.render(view, parent, dataToUse);
    this.labelAdd = this.labelAdd || this.getAttribute('labelAdd');
    const length = this.getData()?.length;
    const html = `
<div class="container-fluid">
<div class="card">
  <div class="card-header"><strong class="text-capitalize">${i18n.get(dataToUse)}</strong>
  <div style="float: right">
  <button click="this.export()" type="button" class="btn btn-outline-secondary btn-sm">
  <i class="bi bi-download"></i></button>
  <button click="this.addItem()" type="button" class="btn btn-outline-primary btn-sm">
    <i class="bi bi-plus"></i>
    ${ this.labelAdd ?? '' }
  </button>
</div>
  </div>
  <div class="card-body" style="padding: 0px;">
    ${ length ?
    `<table class="table table-striped table-hover">
    <thead>
    <tr>${this.getHeader()}</tr>
    </thead>
    <tbody>${this.getTable()}</tbody>
    </table>` :
    `<div class="text-center">${ this.view.loading ?
    `<div class="text-center">
    <div class="spinner-border" role="status"><span class="visually-hidden">${i18n.get('loading')}</span>
    </div></div>` : i18n.get('no-data')}</div>` }
  </div>
  <div class="card-footer text-center">${ length ? `${i18n.get('elements')}: ${length}` : '' }</div>
</div></div>
    `;
    this.return(html);
  }

  public async addItem() {
    this.view.emmit({ action: 'add', idComponent: this.idComponent });
    // TODO: AUTO
    // if (await this.view.openModal(new AddModalView(), 'test')) {
    //   this.getData().push({'id': 1, 'name': 'potato', admin: false});
    // }
  }

  public getHeader() {
    const hdr = this.getAttribute('headers') ? this.getAttribute('headers').split(',') : null;
    this.headers = hdr || Object.keys(this.getData()[0]);
    let header = '';
    this.headers.forEach((key) => {
      header = header.concat(`<th scope="col" class="text-capitalize">${i18n.get(key)}</th>`);
    });

    return header.concat(`<th scope="col" style="text-align: right;">${i18n.get('actions')}</th>`);
  }

  public getTable() {
    let table = '';
    this.getData().forEach((item: any) => {
      table = table.concat('<tr>');
      this.headers.forEach((value: any) => {
        table = table.concat(`<td>${item[value]}</td>`);
      });
      const bitem = window.btoa(JSON.stringify(item));
      table = table.concat(`<td style="text-align: right;">
      <button title="${i18n.get('edit')}" click="this.edit('${bitem}');" type="button" class="btn btn-outline-light btn-sm"><i class="bi bi-pencil"></i></button>
      <button title="${i18n.get('delete')}" click="this.delete('${bitem}');" type="button" class="btn btn-outline-light btn-sm"><i class="bi bi-trash"></i></button>
      </td>`);
      table = table.concat('</tr>');
    });
    return table;
  }

  public export() {
    exportExcel(i18n.get(this.dataToUse), [...this.getData()]);
  }

  public async delete(bitem) {
    const item = JSON.parse(window.atob(bitem));
    if (await this.view.modal.confirm(i18n.get('confirm-delete'), i18n.get('delete'))) {
      this.view.emmit({ action: 'delete', idComponent: this.idComponent, item });
    }
  }

  public async edit(bitem) {
    const item = JSON.parse(window.atob(bitem));
    this.view.emmit({ action: 'edit', idComponent: this.idComponent, item });
  }
}
