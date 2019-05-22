import { AppComponent } from '@sibley/app-component';
import tpl from './app-sidebar.html';

export class AppSidebar extends AppComponent {
  constructor() {
    super();
    this.observedAttributes = AppSidebar.observedAttributes;
    this.initTemplate(tpl, this.data);
  }

  static get observedAttributes() {
    return ['helpme', 'replaceme'];
  }
}

window.customElements.define('app-sidebar', AppSidebar);
