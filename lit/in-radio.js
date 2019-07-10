import { LitElement, html, css } from 'lit-element';
import { genId } from './gen-id.js';


export class InRadio extends LitElement {
  static get properties() {
    return {
      inName: {
        type: String,
        attribute: 'in-name'
      },
      choices: {
        type: Array
      },
      choice: {
        type: String,
        reflect: true
      }
    };
  }

  constructor() {
    super();
    this.checked = [];
    this.genId = (function() {
      const memo = {};
      return function(index) {
        if (!memo[index]) {
          memo[index] = genId();
        }
        return memo[index];
      }
    })();
  }

  firstUpdated() {
    if (!this.choice && this.choices) {
      this.choice = this.choices[0];
    }
  }

  inChange(e) {
    this.choice = e.target.value;

    let event = new CustomEvent('choice-change', {
      detail: {
        choice: this.choice
      }
    });
    this.dispatchEvent(event);
  }

  render() {
    return html`
      ${this.choices.map((item, index) => html`
        <div class="choice">
          <input 
            type="radio" 
            name="${this.inName}" 
            id="${this.genId(index)}" 
            value="${item}" 
            .checked="${(this.choice === item)}" 
            @change="${this.inChange}"
          >
          <label for="${this.genId(index)}">${item}</label>
        </div>
      `)}
    `;
  }
}
customElements.define('in-radio', InRadio);