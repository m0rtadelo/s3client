import { expect } from 'chai';
import { i18n } from './i18';

describe('i18n', () => {
  it('Should have a default lang', () => {
    expect(i18n.lang).to.not.be.undefined;
  });

  it('Should set lang correctly', () => {
    i18n.lang = 'en';
    expect(i18n.lang).equal('en');
  });
});
