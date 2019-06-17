import { LitElement, html, css } from 'lit-element';

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
    return css`
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
      [data-closed] {
        display: none;
      }
    `;
  }

  render() {
    return html`
      <style>
        @import url("./css/typography.css");
      </style>
      <div class="modal b-close-modal" role="dialog" aria-hidden="true" ?data-closed="${!this.open}" @click="${this.handleClick}">
        <div class="modal-window">
            <button class="modal-close b-close-modal">X</button>
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