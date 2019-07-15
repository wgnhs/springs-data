import { LitElement, html, css } from 'lit-element';
import { genId } from './gen-id.js';

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
    .option-container {
      box-sizing: border-box;
      padding: var(--border-radius)
    }
    .icon {
      font-size: var(--icon-size-extra-large);
    }
    `;
  }

  render() {
    return html`
      <style>
        @import url("./css/typography.css");
      </style>
      <h3>View sites by value:</h3>
      <div class="option-container">
        <map-control-item @click="${this.typePoints}">
          <div slot="item-before"><span>Spring Type</span></div>
          <div slot="item"></div>
          <i slot="item-after" class="icon material-icons" title="View on map">map</i>
        </map-control-item>
        <map-control-item @click="${this.condPoints}">
          <div slot="item-before"><span>Conductivity</span></div>
          <div slot="item"></div>
          <i slot="item-after" class="icon material-icons" title="View on map">map</i>
        </map-control-item>
        <map-control-item @click="${this.qPoints}">
          <div slot="item-before"><span>Discharge</span></div>
          <div slot="item"></div>
          <i slot="item-after" class="icon material-icons" title="View on map">map</i>
        </map-control-item>
        <map-control-item @click="${this.normalPoints}">
          <div slot="item-before">Reset</div>
          <i slot="item-after" class="icon material-icons" title="View on map">clear</i>
        </map-control-item>
      </div>
    `;
  }

  handleSelection(fn) {

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

export class MapControlItem extends LitElement {
  static get properties() {
    return {
      selected: {
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

    input[type='checkbox'] {
      display: none;
    }
    .lbl-toggle {
      display: block;
      text-align: center;
      cursor: pointer;
    }
    .lbl-toggle:hover {
      color: var(--palette-900);
    }
    .lbl-toggle:focus {
      outline: thin dotted;
    }
    .option-row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      background: var(--palette-white);
      color: var(--palette-accent);
      border: 1px solid var(--palette-light);
      border-radius: var(--border-radius);
      padding: var(--font-size);
      margin: var(--border-radius) 0;
    }
    /* .toggle:checked + .option-row {
      background: var(--palette-light);
      color: var(--palette-900);
    } */
    .option-row > div {
      display: flex;
      align-items: center;
    }
    `;
  }

  render() {
    return html`
    <input id="${this.genId}" class="toggle" type="checkbox">
    <label for="${this.genId}" class="lbl-toggle option-row" tabindex="0">
      <!-- <div class="option-row"> -->
        <div><slot name="item-before"></slot></div>
        <div><slot name="item"></slot></div>
        <div><slot name="item-after"></slot></div>
      <!-- </div> -->
    </label>
    `;
  }

  firstUpdated() {
    this.$input = this.renderRoot.querySelector('.toggle');
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
customElements.define('map-control-item', MapControlItem);