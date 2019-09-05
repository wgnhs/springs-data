import { LitElement, html, css } from 'lit-element';
import { styles } from 'wgnhs-styles';
export { AppCollapsible } from 'wgnhs-layout';
export { DownloadSection } from './download-section.js';

const TOGGLE_EVENT = 'toggle-pdf-panel';

export class SiteSketchButton extends LitElement {
  static get properties() {
    return {
      src: {
        type: String
      },
      panel: {
        type: Object,
        attribute: false
      },
      closed: {
        type: Boolean,
        attribute: false
      }
    };
  }

  constructor() {
    super();
    this.closed=true;
  }

  static get styles() {
    return [
      ...styles,
      css``
    ];
  }

  render() {
    return html`
    <app-collapsible @open="${this.toggle}" button>
      <i slot="header-before" class="material-icons" title="Site sketch map">picture_as_pdf</i>
      <span slot="header">Site sketch map</span>
      <i slot="header-after" class="material-icons">${
          (!this.closed)?'chevron_left':'chevron_right'
        }</i>
    </app-collapsible>
    `;
  }

  updated(prev) {
    if ((prev.has('panel') || prev.has('src'))) {
      if (this.panel && this.src) {
        this.panel.request(this.src)
      }
    }
  }

  toggle(e) {
    if (!this.closed) {
      this.panel.hide();
    } else {
      this.panel.show(this.src);
    }
  }

  handleAlt(e) {
    if (e.detail.url === this.src) {
      this.closed = false;
    } else {
      this.closed = true;
    }
    this.requestUpdate();
  }

  connectedCallback() {
    super.connectedCallback();
    this.__altHandler = this.handleAlt.bind(this);
    document.addEventListener(TOGGLE_EVENT, this.__altHandler);
  }

  disconnectedCallback() {
    document.removeEventListener(TOGGLE_EVENT, this.__altHandler);
    super.disconnectedCallback();
  }
}
customElements.define('site-sketch-button', SiteSketchButton);
