import { AppComponent } from '@sibley/app-component';
import tpl from './app-sidebar.html';

export class AppSidebar extends AppComponent {
  constructor() {
    super();
    AppComponent.init(this, AppSidebar, tpl);

    this.data.renderTime = function() {
      return new Date();
    }

    var track = (function() {
      this.data.trackTime = this.data.renderTime();
    }).bind(this);
    setInterval(track, 1000);
  }

  get eventListeners() {
    return [
      ['attributechange', 'in-radio', (function(event) {
        this.switchTab(this.$views.getAttribute('choice'));
      }).bind(this)]
    ];
  }

  switchTab(choice) {
    this.shadowRoot.querySelectorAll('slot').forEach((el) => {
      if ((choice === 'default' && !el.getAttribute('name')) || (el.getAttribute('name') === choice)) {
        el.hidden = false;
      } else {
        el.hidden = true;
      }
    });
  }

  static get observedAttributes() {
    return ['title'];
  }
}

window.customElements.define('app-sidebar', AppSidebar);
