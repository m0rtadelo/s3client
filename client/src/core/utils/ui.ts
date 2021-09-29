import { EVENT_LISTENERS, EVENT_KEY } from '../components/component.constants';
import { View, Component } from '..';

export const get = (id: string): any => document.getElementById(id);

export const getFormData = (): any => {
  const inputFields = document.getElementsByTagName('input');
  let data = {};
  for (let i = 0; i < inputFields.length; i++) {
    const { id } = inputFields[i];
    const htmlItem = get(id);
    if (id && htmlItem && htmlItem !== {}) {
      data = { ...data, [id]: htmlItem.value };
    }
  }
  return data;
};

export const putFormData = (formData: any): void => {
  Object.keys(formData).forEach((id) => {
    get(id).value = formData[id];
  });
};

export const addEventListener = (
    id: string,
    event: string,
    action: Function,
) => {
  const element = get(id);
  if (element) {
    element.addEventListener(event, async (elem: any) => {
      try {
        elem?.preventDefault();
        return await action();
      } catch (error) {
        console.error(error);
      }
    });
  }
};

export const addListeners = (rootElement: HTMLElement, include: boolean, context: View | Component) => {
  if (include) {
    addNodeListener(rootElement, context);
  }
  EVENT_LISTENERS.forEach((el) => {
    addChildrenListeners(rootElement, el, context);
  });
};

const addChildrenListeners = (element: HTMLElement, eventType: string, context: View | Component) => {
  const nodes = element.getElementsByTagName('*');
  for (let i=0; i<nodes.length; i++) {
    const nodeEl: Element = nodes.item(i);
    addEvent(nodeEl, eventType, context);
  }
};

const addNodeListener = (element: any, context: View | Component) => {
  EVENT_LISTENERS.forEach((el) => {
    addEvent(element, el, context);
  });
};

const addEvent = (element: any, eventType: string, context: View | Component) => {
  const eventCode = element.getAttribute(eventType);
  if (eventCode && !element.getAttribute(EVENT_KEY.concat(eventType))) {
    element.setAttribute(EVENT_KEY.concat(eventType), 'true');
    context.injectEvent(element, eventType, eventCode);
  }
};
