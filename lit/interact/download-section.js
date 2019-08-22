import { LitElement, html, css } from 'lit-element';
import { styles } from '../styles/index.js';

export class DownloadSection extends LitElement {
  static get properties() {
    return {
      file: {
        type: String
      }
    };
  }

  constructor() {
    super();
  }

  static get styles() {
    return [
      ...styles,
      css`
    a {
      text-decoration: none;
    }
    .download-button:hover {
      color: var(--palette-900);
    }
    .download-button:focus {
      outline: thin dotted;
    }
    .download-button {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      cursor: pointer;
      text-align: center;
      background: var(--palette-white);
      color: var(--palette-accent);
      border: 1px solid var(--palette-light);
      border-radius: var(--border-radius);
      padding: var(--font-size);
      margin: var(--border-radius) 0;
    }
    .download-button > div {
      display: flex;
      align-items: center;
    }
    .icon {
      font-size: var(--icon-size-extra-large);
    }
    `];
  }

  render() {
    return html`
    <a class="download-button" href="${this.file}" target="_blank" download>
      <div>
        <span>Download</span>
      </div>
      <div>
        <i class="icon material-icons" title="Download">save_alt</i>
      </div>
    </a>
    `;
  }
}
customElements.define('download-section', DownloadSection);