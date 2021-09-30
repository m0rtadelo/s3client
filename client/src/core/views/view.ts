import { createToast, destoryAllToasts } from 'vercel-toast';
import { get, addListeners } from '../utils/ui';
import { Service } from '../services/service';
import { Component } from '../components/component';
import { deepCopy } from '../utils/obj';
import { APP_NODE, ID, DATA_KEY, REQUIRED_HTML, NOTIFY_TIMEOUT } from './view.constants';
import { INTERVAL } from '../constants';
import { Modals } from '../utils/modals';
import { Model } from '../../model';

export class View {
  protected service: Service;
  public modal = new Modals(this); // eslint-disable-line no-invalid-this
  public loading = false;
  public activeComponents: Array<Component> = [];
  public model = new Model();
  public holder: any;
  public static active: View;
  public static _res: any;
  public view: string;
  public components: Array<Component>;
  private lastNotify = 0;
  private lastMsg = '';

  constructor(view: string, components?: Array<Component>, data?: any, service?: Service, isModal?: boolean) {
    this.loading = true;
    this.view = view;
    this.components = components;
    this.runCode.bind(this);
    this.model = data || this.model;
    if (!isModal) {
      get(APP_NODE).innerHTML = REQUIRED_HTML.concat(view);
      addListeners(get(APP_NODE), false, this);
      this.addComponents(components);
    }
    this.service = service;
    if (View.active && !isModal) {
      View.active.activeComponents.forEach((comp) => {
        comp.destroy();
      });
      View.active.onDestroy();
      View.active = undefined;
    }
    View.active = this;
    this.loading = false;
    setTimeout(() => {
      this.onReady();
    }, INTERVAL);
  }

  /**
   * Checks and creates components on the baseNode binding events to the context
   * @param {Array<Component>} components components required to render this view
   * @param {any} baseNode related HTML node element
   * @param {View} context events binds to this context
   */
  public addComponents(components: Array<Component>, baseNode = document, context: View = this): void {
    components?.forEach((component) => {
      const domElements = baseNode.getElementsByTagName(component.selector);
      for (let i = 0; i < domElements.length; i++) {
        const element = domElements[i];
        const clon: Component = deepCopy(component);
        context.activeComponents.push(clon);
        clon.enable();
        const actualId = element.getAttribute(ID);
        if (actualId) {
          clon.idComponent = actualId;
        } else {
          element.setAttribute(ID, clon.idComponent);
        }
        const elementData = element.getAttribute(DATA_KEY);
        clon.render(context, element, elementData);
      }
    });
  }
  /**
   * Returns the component by id
   * @param {string} id the component id
   * @return {Component} the component
   */
  public getComponentById(id: string) {
    return this.activeComponents.find((cmp) => cmp.idComponent === id);
  }

  /**
   * Returns the active component
   * @return {Component} the active component
   */
  public getActiveComponent() {
    return Component.active;
  }

  public injectEvent(element: HTMLElement, eventType: string, code: string) {
    element.addEventListener(eventType, ((event) => {
      event?.preventDefault();
      this.runCode(code);
    }));
  }

  public notifyClear() {
    destoryAllToasts();
  }

  public notifySuccess(msg: string) {
    this.notify(msg, 'success');
  }

  public notifyError(msg: string) {
    this.notify(msg, 'error');
  }

  public notifyWarning(msg: string) {
    this.notify(msg, 'warning');
  }

  public notifyInfo(msg: string) {
    this.notify(msg, 'info');
  }

  public confirmCancel() {
    View._res?.(false);
  }

  public confirmConfirm() {
    View._res?.(View.active.model || true);
  }

  public modalChange() {
    View.active.model = get('modal_input').value;
  }
  public onReady() {}

  public onDestroy() {
    if ((window as any).api) {
      (window as any).api.message(undefined);
    }
  }

  public onChanges() {}

  public emmit(data: any) {}

  public message(message: any) {}

  public sendMessage(message: any) {
    (window as any).api.sendMessage(message);
  }

  private notify(message: string, style: string = 'success'): void {
    const map = {
      info: { i: 'info-lg', t: 'default' },
      success: { i: 'check-lg', t: 'success' },
      error: { i: 'x-lg', t: 'error' },
      warning: { i: 'exclamation-lg', t: 'warning' },
    };
    const notiTime = new Date().getTime();
    if (this.lastNotify + 1000 < notiTime || this.lastMsg !== message) {
      const element = document.createElement('div');
      element.innerHTML = `<i class="bi-${map[style].i}"></i> `.concat(message);
      const toast = createToast(element, {
        type: map[style].t,
        timeout: NOTIFY_TIMEOUT,
      });
      this.lastNotify = notiTime;
      this.lastMsg = message;
      toast.el.addEventListener('click', (elem) => {
        elem.preventDefault();
        toast.destory();
      });
    }
  }

  private runCode(code: string) {
    eval(code);
  }
}
