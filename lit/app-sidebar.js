import { LitElement, html, css } from 'lit-element';
import { InRadio } from './in-radio.js';

function renderTime() {
  return new Date();
}

export class AppSidebar extends LitElement {
  static get properties() {
    return {
      title: {
        type: String
      },
      trackTime: {
        type: Date,
        attribute: false
      }
    };
  }

  constructor() {
    super();
    this.renderTime = renderTime();
    
    let track = (function() {
      this.trackTime = renderTime();
    }).bind(this);
    setInterval(track, 1000);
  }

  static get styles() {
    return css`
      :host {
        padding: 0 1.5em 1.5em 1.5em;
      }

      .header {
        position: -webkit-sticky;
        position: sticky;
        top: 0px;
        background-color: var(--palette-white);
        padding: 1em;
      }

      [data-element=views] {
        display: grid;
        grid-template-columns: 33% 33% 33%;
      }
    `;
  }

  switchTab(choice) {
    if (choice !== this.$views.choice) {
      this.$views.choice = choice;
    }
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
      <div>The current time is <span>${this.trackTime}</span></div>
      <in-radio
        data-element="views"
        in-name="view"
        choices='["default","filter","details"]'
        @choice-change="${this.handleChoiceChange}"
      ></in-radio>
      <slot></slot>
      <slot name="filter" hidden></slot>
      <slot name="details" hidden></slot>
      <div>Last refresh: ${this.renderTime}</div>
    `;
  }

  firstUpdated() {
    Object.assign(this, gatherElements(this.renderRoot, 'data-element'));
  }
}

function gatherElements(doc, attributeName) {
  let result = {};
  let elements = doc.querySelectorAll('[' + attributeName + ']');
  for (let el of elements) {
    let name = '$' + el.getAttribute(attributeName);
    result[name] = el;
  }
  return result;
};

customElements.define('app-sidebar', AppSidebar);