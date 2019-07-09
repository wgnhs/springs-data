import { LitElement, html, css } from 'lit-element';

export class MapControls extends LitElement {
  static get properties() {
    return {

    };
  }

  constructor() {
    super();
  }

  static get styles() {
    return css`
    `;
  }

  render() {
    return html`
      <div>
        <h4>Map Point Styles:</h4>
        <button @click="${this.normalPoints}">Normal Styling</button>
        <button @click="${this.typePoints}">Style by Spring Type</button>
        <button @click="${this.condPoints}">Style by Conductivity</button>
        <button @click="${this.qPoints}">Style by Discharge</button>
      </div>
    `;
  }

  normalPoints() {
    map.fire('normalpoints');
  }
  typePoints() {
    map.fire('typepoints');
  }
  condPoints() {
    map.fire('condpoints');
  }
  qPoints() {
    map.fire('qpoints');
  }
}
customElements.define('map-controls', MapControls);