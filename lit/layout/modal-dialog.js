import { LitElement, html, css } from 'lit-element';
import { styles } from '../styles/index.js';

export class ModalDialog extends LitElement {
  static get properties() {
    return {
      open: {
        type: Boolean,
        attribute: 'open-modal',
        reflect: true
      },
      source: {
        type: String
      }
    };
  }

  constructor() {
    super();
    this.open = false;
  }

  static get styles() {
    return [
      ...styles,
      css`
      .modal {
        position: fixed;
        background: var(--palette-accent-transparent);
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: var(--z-index-interrupt);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .modal-window {
        position: relative;
        padding: 0.5em;
        border-radius: var(--border-radius);
        background: var(--palette-light);
      }
      .modal-content {
        max-height: 90vh;
        max-width: 90vw;
      }
      .modal-close {
        position: absolute;
        top: 0;
        right: 0;
        border-radius: var(--border-radius);
      }
      .control {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: var(--icon-size-large);
        color: var(--palette-accent);
        text-align: center;
        cursor: pointer;
        padding: var(--border-radius);
        background-color: var(--palette-light);
        border: none;
        border-radius: 50%;
      }
      [data-closed] {
        display: none;
      }
    `];
  }

  render() {
    return html`
      <div class="modal b-close-modal" role="dialog" aria-hidden="true" ?data-closed="${!this.open}" @click="${this.handleClick}">
        <div class="modal-window">
            <button class="control modal-close b-close-modal"><i class="material-icons b-close-modal" title="Hide">close</i></button>
            ${(!this.source)?'':html`
              <img class="modal-content" src="${this.source}" />
            `}
        </div>
      </div>
    `;
  }

  toggleOpen() {
    this.open = !this.open;
  }

  handleClick(e) {
    if (e.target.classList.contains('b-close-modal')) {
      this.toggleOpen();
    }
  }
}
customElements.define('modal-dialog', ModalDialog);