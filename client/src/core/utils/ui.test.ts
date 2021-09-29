import { expect } from 'chai';
import { addEventListener, get, getFormData, putFormData, addListeners } from '..';
import { View } from '../views/view';
import { Component } from '../components/component';
import { Service } from '../services/service';
const jsdom = require('jsdom');
const stdout = require('test-console').stderr;
const { JSDOM } = jsdom;
const html = `<html><form id="form" click="this.test()"><input id="user" click="this.test()" value="user">
<input id="pass" value="pass"></form><app id="root"></app></html>`;
const { window } = new JSDOM(html);
const { document } = (new JSDOM(html)).window;

class MockView extends View {
  public touched = false;
  constructor(view: string, components?: Array<Component>, data?: any, service?: Service, isModal?: boolean) {
    super(view, components, data, service, isModal);
  }

  test() {
    this.touched = true;
  };
};


describe('(UI) User Interface', () => {
  beforeEach(() => {
    global.document = document;
    global.window = window;
  });
  it('should get form data', () => {
    const fd = getFormData();
    expect(fd.user).equal('user');
    expect(fd.pass).equals('pass');
  });

  it('should put form data', () => {
    putFormData({ user: 'user2', pass: 'pass2' });
    const fd = getFormData();
    expect(fd.user).equal('user2');
    expect(fd.pass).equals('pass2');
  });

  it('should add event listener', () => {
    let clicked = false;
    addEventListener('users', 'click', () => {
      clicked = true;
    });
    get('user').click();
    expect(clicked).equals(false);
    addEventListener('user', 'click', () => {
      clicked = true;
    });
    get('user').click();
    expect(clicked).equals(true);
  });

  it('should parse listeners into html (childs)', () => {
    const v = new MockView('<div id="view">view</div>');
    addListeners(get('form'), false, v);
    get('form').click();
    expect(v.touched).equals(false);
    get('user').click();
    expect(v.touched).equals(true);
  });

  it('should parse listeners into html (all)', () => {
    const v = new MockView('<div id="view">view</div>');
    addListeners(get('form'), true, v);
    get('form').click();
    expect(v.touched).equals(true);
    v.touched = false;
    get('user').click();
    expect(v.touched).equals(true);
  });

  it('should write error on console', () => {
    addEventListener('user', 'click', () => {
      throw new Error('test error');
    });
    const errorObj = stdout.inspectSync(() => {
      get('user').click();
    });
    expect(errorObj[0].includes('test error')).equals(true);
  });
});
