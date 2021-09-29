import { get, addListeners, View } from '..';
import { i18n } from '../services/i18';
import { TAG_KEY } from '../views/view.constants';
import { getId } from './uid';

export class Modals {
  private _view: View;
  public static value;
  constructor(view: View) {
    this._view = view;
  }
  public message(msg: string, title?: string): Promise<void> {
    get(TAG_KEY).innerHTML = this.getHtmlModal(false).replace('$msg', msg).replace('$title', title || i18n.get('message'));
    addListeners(get(TAG_KEY), false, this._view);
    return new Promise(() => {
      get('openModal').click();
    });
  }
  public confirm(msg: string, title?: string): Promise<boolean> {
    get(TAG_KEY).innerHTML = this.getHtmlModal().replace('$msg', msg).replace('$title', title || i18n.get('confirm'));
    addListeners(get(TAG_KEY), false, this._view);
    return new Promise((res) => {
      get('openModal').click();
      View._res = res;
    });
  }

  public input(msg: string, title?: string, type:string = 'text', value:string = ''): Promise<string> {
    const id = getId();
    const group = `
    <form id="${id}">
    <label for="input" class="form-label">${msg}</label>
    <input type="${type}" class="form-control" value="${value}" id="modal_input" change="this.modalChange()"></input>
    </form>
    `;
    const v = new View(group, [], undefined, undefined, true);
    get(TAG_KEY).innerHTML = this.getHtmlModal().replace('$msg', v.view).replace('$title', title || i18n.get('input'));
    get('modal-body').innerHTML = v.view;
    addListeners(get(TAG_KEY), false, this._view);
    return new Promise((res) => {
      get('openModal').click();
      setTimeout(() => {
        get('modal_input').focus();
        get(id).addEventListener('submit', (elem) => {
          elem.preventDefault();
          get('openModal').click();
          this._view.confirmConfirm();
        });
      }, 500);
      View._res = res;
    });
  }

  public open(view: View, title?: string): Promise<any> {
    get(TAG_KEY).innerHTML = this.getHtmlModal().replace('$title', title || 'Modal');
    get('modal-body').innerHTML = view.view;
    addListeners(get(TAG_KEY), false, view);
    this._view.addComponents(view.components, get('modal-body'), view);
    return new Promise((res) => {
      get('openModal').click();
      View._res = res;
    });
  }

  private getHtmlModal(withCancel = true) {
    return `
  <button id="openModal" type="button" style="display: none;" data-bs-toggle="modal"
    data-bs-target="#staticBackdrop"></button>
  <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">$title</h5>
          <button click="this.confirmCancel()" type="button" class="btn-close" data-bs-dismiss="modal"
            aria-label="Close"></button>
        </div>
        <div class="modal-body" id="modal-body">
          $msg
        </div>
        <div class="modal-footer">
          ${withCancel ?
            `<button id="buttonModalCancel" click="this.confirmCancel()" type="button" class="btn btn-secondary"
          data-bs-dismiss="modal">${i18n.get('cancel')}</button>` : ''}
          <button id="buttonModalConfirm" click="this.confirmConfirm()" type="button" class="btn btn-primary"
            data-bs-dismiss="modal">${i18n.get('confirm')}</button>
        </div>
      </div>
    </div>
  </div>
    `;
  }
}
