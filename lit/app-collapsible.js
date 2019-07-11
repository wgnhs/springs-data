import { LitElement, html, css } from 'lit-element';
import { genId } from './gen-id.js';

/**
 * Code use and modified from
 * https://alligator.io/css/collapsible/
 */
export class AppCollapsible extends LitElement {
  static get properties() {
    return {
      genId: {
        type: String,
        attribute: false
      },
      open: {
        type: Boolean
      }
    };
  }

  constructor() {
    super();
    this.genId = genId();
  }

  static get styles() {
    return css`
    .wrap-collapsible {
      margin: 1.2rem 0;
    }

    input[type='checkbox'] {
      display: none;
    }

    .lbl-toggle {
      display: block;

      font-weight: bold;
      font-family: monospace;
      font-size: 1.2rem;
      text-transform: uppercase;
      text-align: center;

      padding: 1rem;

      color: #A77B0E;
      background: #FAE042;

      cursor: pointer;

      border-radius: 7px;
      transition: all 0.25s ease-out;
    }

    .lbl-toggle:hover {
      color: #7C5A0B;
    }

    .lbl-toggle::before {
      content: ' ';
      display: inline-block;

      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
      border-left: 5px solid currentColor;
      vertical-align: middle;
      margin-right: .7rem;
      transform: translateY(-2px);

      transition: transform .2s ease-out;
    }

    .toggle:checked + .lbl-toggle::before {
      transform: rotate(90deg) translateX(-3px);
    }

    .collapsible-content {
      max-height: 0px;
      overflow: hidden;
      /* transition: max-height .25s ease-in-out; */
    }

    .toggle:checked + .lbl-toggle + .collapsible-content {
      max-height: 9999px;
    }

    .toggle:checked + .lbl-toggle {
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
    }

    .collapsible-content .content-inner {
      background: rgba(250, 224, 66, .2);
      border-bottom: 1px solid rgba(250, 224, 66, .45);
      border-bottom-left-radius: 7px;
      border-bottom-right-radius: 7px;
      padding: .5rem 1rem;
    }
    `;
  }

  render() {
    return html`
    <div class="wrap-collapsible">
      <input id="${this.genId}" class="toggle" type="checkbox" ?checked="${this.open}">
      <label for="${this.genId}" class="lbl-toggle" tabindex="0"><slot name="header"></slot></label>
      <div class="collapsible-content">
        <div class="content-inner">
          <slot name="content"></slot>
        </div>
      </div>
    </div>
    `;
  }

  firstUpdated() {
    let myLabels = this.renderRoot.querySelectorAll('.lbl-toggle');

    Array.from(myLabels).forEach(label => {
      label.addEventListener('keydown', e => {
        // 32 === spacebar
        // 13 === enter
        if (e.which === 32 || e.which === 13) {
          e.preventDefault();
          label.click();
        };
      });
    });
  }
}
customElements.define('app-collapsible', AppCollapsible);