import { Component, getFormData, View } from '../../core';
import { i18n } from '../../core/services/i18';

export class ConfigComponent extends Component {
  public selector = 'config';

  public render(view: View, parent: any) {
    super.render(view, parent);
    super.return(this.getHTML(view));
  }

  private submit() {
    const values = getFormData();
    Object.keys(values).forEach((key) => {
      this.view.model.buckets[0][key] = values[key];
    });
    this.view.emmit(values);
  }

  private getHTML(view) {
    return `
    <form id="config" submit="this.submit()" onsubmit="return false;">
    <div class="center-screen">

  <div class="card">
    <h5 class="card-header text-center">${i18n.get('connectionData')}</h5>
    <div class="card-body">
<!--
    <div class="input-group mb-3">
    <label class="input-group-text" for="lang">${i18n.get('language')}</label>
    <select class="form-select" id="lang" change="this.change('lang')">
      <option value="en" ${i18n.lang === 'en' ? 'selected' : ''}>English</option>
      <option value="es" ${i18n.lang === 'es' ? 'selected' : ''}>Castellano</option>
      <option value="ca" ${i18n.lang === 'ca' ? 'selected' : ''}>Català</option>
    </select>
    </div>        
-->
    <div class="input-group mb-3">
    <label class="input-group-text" for="accessKeyId">accessKeyId</label>
    <input type="text" id="accessKeyId" class="form-control" autofocus required ${view.loading ? 'disabled' : ''}
    value="${view.model?.buckets?.[0]?.accessKeyId || ''}">
    </div>        

    <div class="input-group mb-3">
    <label class="input-group-text" for="secretAccessKey">secretAccessKey</label>
    <input type="text" id="secretAccessKey" class="form-control" required ${view.loading ? 'disabled' : ''}
    value="${view.model?.buckets?.[0]?.secretAccessKey || ''}">
    </div>        

    <div class="input-group mb-3">
    <label class="input-group-text" for="region">Region</label>
    <input type="text" id="region" class="form-control" required ${view.loading ? 'disabled' : ''}
    value="${view.model?.buckets?.[0]?.region || ''}">
    </div>        

    <div class="input-group mb-3">
    <label class="input-group-text" for="bucket">Bucket name</label>
    <input type="text" id="bucket" class="form-control" required ${view.loading ? 'disabled' : ''}
    value="${view.model?.buckets?.[0]?.bucket || ''}">
    </div>        

    ${view.model.error ? `
    <div class="alert alert-danger" role="alert">
      ${view.model.error}
    </div>
    ` : '' }

    <button type="submit" class="btn btn-primary col-12" ${view.loading ? 'disabled' : ''}>${view.loading ? 'Loading...' : 'Accept'}</button>
    </div>
    </div>
    </form>
    `;
  }
}
