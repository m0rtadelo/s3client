import { View, addListeners } from '..';
import { IComponent } from './component.interface';
import { INTERVAL } from '../constants';
import { getId } from '../utils/uid';

export class Component implements IComponent {
  public static active: Component;
  public static event: Component;
  public selector: string;
  public idComponent: string;
  public view: View;
  public dataToUse: any;
  private parent: any;
  private self: any;
  private ttl = 0;
  private previousReturn = '';
  private enabled = true;
  private attributes = {};
  private static counter = 0;
  private static hash = getId();
  private static eventComponents: any = {};
  constructor() {
    this.runCode.bind(this);
  }

  private static getHash() {
    Component.counter++;
    return Component.hash.concat(Component.counter.toString());
  }

  public enable() {
    this.idComponent = Component.getHash();
    this.self = setInterval(() => {
      if (this.parent && this.enabled) {
        this.render(this.view, this.parent, this.dataToUse);
      } else {
        this.ttl++;
        if (this.ttl > 20) {
          clearInterval(this.self);
        }
      }
    }, INTERVAL);
  }

  public destroy() {
    this.enabled = false;
    clearInterval(this.self);
    this.parent.innerHTML = '';
  }

  public render(view: View, parent: any, dataToUse?: string) {
    Component.active = this;
    this.view = view;
    this.parent = parent;
    this.dataToUse = dataToUse;
  }

  public return(html: string): boolean {
    if (html === this.previousReturn) {
      return false;
    }
    this.parent.innerHTML = html;
    addListeners(this.parent, true, this);
    this.previousReturn = html;
    this.view.onChanges();

    return true;
  }

  public setAttribute(param: string, value: any) {
    this.attributes[param] = value;
  }

  public getAttribute(param: string) {
    if (this.attributes[param]) {
      return this.attributes[param];
    }
    if (this.parent) {
      this.attributes[param] = this.parent.getAttribute(param);
    }
    return this.attributes[param];
  }

  public getData(): any {
    return !this.dataToUse ?
    this.view.model :
    (this.view as any)[this.dataToUse];
  }

  public setData(newData: any): void {
    this.dataToUse ?
    (this.view as any)[this.dataToUse] = newData :
      this.view.model = newData;
  }

  public injectEvent(element: HTMLElement, eventType:string, code: string) {
    element.addEventListener(eventType, (() => {
      this.runCode(code);
    }));
  }

  private runCode(code: string) {
    Component.event = this;
    eval(code);
  }
}
