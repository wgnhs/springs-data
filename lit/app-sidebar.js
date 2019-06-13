import { LitElement, html, css } from 'lit-element';
import { InRadio } from './in-radio.js';

export class AppSidebar extends LitElement {
  static get properties() {
    return {
      title: {
        type: String
      }
    };
  }

  constructor() {
    super();
  }

  static get styles() {
    return css`
      :host {
        padding: 0 1.5em 1.5em 1.5em;
      }
    `;
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

  handleChoiceChange(e) {
    this.switchTab(e.detail.choice);
  }

  render() {
    return html`
      <style>
        @import url("./css/typography.css");
      </style>

      <h1 class="header">${this.title}</h1>
      <slot></slot>
      <slot name="details" hidden></slot>
    `;
  }
}

customElements.define('app-sidebar', AppSidebar);