import { AppComponent } from '@sibley/app-component';
import tpl from './{{mod-name}}.html';

export class {{mod-class}} extends AppComponent {
  constructor() {
    super();
    AppComponent.init(this, {{mod-class}}, tpl);
  }

  static get observedAttributes() {
    return [];
  }
}

window.customElements.define('{{mod-name}}', {{mod-class}});