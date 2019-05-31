import { AppComponent } from '@sibley/app-component';
import { genId } from './gen-id.js';
import tpl from './site-details.html';

export class SiteDetails extends AppComponent {
  constructor() {
    super();
    AppComponent.init(this, SiteDetails, tpl);

    this.observedAttributes['siteinfo'].push(this.renderTable.bind(this));
  }

  static get observedAttributes() {
    return [
      'siteinfo'
    ];
  }

  renderTable() {
    const container = this.$table,
    template = this.$rowTpl;
    if (!container || !template || !this.data.siteinfo ) {
      return;
    }
    container.querySelectorAll('*').forEach((el) => {el.remove()});

    for (const [key, value] of Object.entries(this.data.siteinfo)) {
      let tplb = AppComponent.stashe(template.content.cloneNode(true));
      let context = {};
      context.id = genId();
      context.key = key;
      context.value = value;
      let result = tplb(context);
      container.appendChild(result);
    }
  }
}

window.customElements.define('site-details', SiteDetails);