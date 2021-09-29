import { Component, View } from '../../core';
import { i18n } from '../../core/services/i18';

export class LangpickerComponent extends Component {
  public selector = 'lang-picker';

  public render(view: View, parent: any) {
    super.render(view, parent);
    super.return(`
    <style>
    lang-picker div div {
      color: #EEEEEE;
      width: 2em;
      height: 2em;
      text-transform: uppercase;
      font-weight: bold;
      margin: 1em 1em 0em 0em;
      cursor: pointer;
      text-align: center;
    }
    lang-picker div div:hover {
      color: #AAAAAA;  
      cursor: pointer;
    }
    lang-picker .selected {
      background-color: #DDDDDD;
    }
    </style>
    <div style="display: ${view.loading ? 'none' : 'flex'}; right: 0; top:0; position: absolute;">
      <div click="this.changeLang('en')" class="${i18n.lang === 'en' ? 'selected' : ''}">EN</div> 
      <div click="this.changeLang('es')" class="${i18n.lang === 'es' ? 'selected' : ''}">ES</div>
      <div click="this.changeLang('ca')" class="${i18n.lang === 'ca' ? 'selected' : ''}">CA</div>
    </div>
    `);
  }

  public changeLang(lang: string) {
    i18n.lang = lang;
  }
}
