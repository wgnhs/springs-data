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

  _fire(eventName, detail) {
    let event = new CustomEvent(eventName, {
      bubbles: true,
      detail: detail || {}
    });
    this.dispatchEvent(event);
  }
  normalPoints() {
    this._fire('stylepoints', {type: 'normal'});
  }
  typePoints() {
    this._fire('stylepoints', {type: 'type'});
  }
  condPoints() {
    this._fire('stylepoints', {type: 'cond'});
  }
  qPoints() {
    this._fire('stylepoints', {type: 'q'});
  }
}
customElements.define('map-controls', MapControls);