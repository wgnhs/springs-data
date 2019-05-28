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
      let result = template.content.cloneNode(true);
      let id = genId();
      
      let $label = result.querySelector('label');
      $label.setAttribute('for', id);
      $label.textContent = key;

      let $span = result.querySelector('span');
      $span.setAttribute('id', id);
      $span.textContent = value;
      container.appendChild(result);
    }
  }
}

window.customElements.define('site-details', SiteDetails);