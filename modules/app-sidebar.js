import { AppComponent } from '@sibley/app-component';
import tpl from './app-sidebar.html';

export class AppSidebar extends AppComponent {
  constructor() {
    super();
    this.observedAttributes = AppSidebar.observedAttributes;
    this.initTemplate(tpl, this.data);

    this.data.renderTime = function() {
      return new Date();
    }

    var track = (function() {
      this.data.trackTime = this.data.renderTime();
    }).bind(this);
    setInterval(track, 1000);
  }

  static get observedAttributes() {
    return ['title'];
  }
}

window.customElements.define('app-sidebar', AppSidebar);
