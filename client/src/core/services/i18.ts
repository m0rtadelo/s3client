export class i18n {
  private static _lang: string = 'en';

  public static set lang(language: string) {
    this._lang = language;
  };
  public static get lang(): string {
    return this._lang;
  }

  public static get(id: string, lang?: string) {
    lang = lang || this._lang;
    const dict = require(`../../i18/${lang}.json`);
    return dict[id] || id;
  }
}
