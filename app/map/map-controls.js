import { LitElement, html, css } from 'lit-element';
import { genId, dispatch } from 'wgnhs-common';
import { styles } from 'wgnhs-styles';
export { AppCollapsible } from 'wgnhs-layout';

import {
  dischargeDotPlotOptions,
  conductivityDotPlotOptions
} from '../details/site-water-quality.js';
export { DotPlotElement } from '../details/site-water-quality.js';

const CHANGE_EVENT = 'map-control';
const STYLE_EVENT = 'stylepoints';
const RESET_TYPE = 'normal';

export class MapControls extends LitElement {
  static get properties() {
    return {
      alldata: {
        type: Object,
        attribute: false
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
      .option-container {
        box-sizing: border-box;
        padding: var(--border-radius)
      }
      .plot-container {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .type-container {
        margin: var(--font-size);
      }
    `];
  }

  render() {
    return html`
      <div class="option-container">
        <map-control-item 
          name="Spring Type"
          type="type">
          <div class="type-container">
            <div><legend-dot></legend-dot><span>Fracture or contact spring</span></div>
            <div><legend-dot alt></legend-dot><span>Seepage-filtration morphology</span></div>
          </div>
          <p>
          About 26 percent of the springs inventoried emerge as fracture or contact springs, and 74 
          percent have seepage-filtration morphologies. At a fracture spring, groundwater discharges 
          from joints or fractures in bedrock. Contact springs discharge water at a stratigraphic 
          contact, along which fractures often form. Groundwater discharges from many small openings 
          in permeable, unlithified material at a seepage-filtration spring.
          </p>
        </map-control-item>
        <map-control-item 
          name="Discharge (cfs)"
          type="q">
          <div class="plot-container">
            <dot-plot
              .options="${dischargeDotPlotOptions}"
              .alldata="${this.alldata}"></dot-plot>
          </div>
          <p>
          The average flow rate of the springs for which flow could be measured was 0.96 ft&sup3;/s; 
          values ranged from 0.14 ft&sup3;/s to 18.3 ft&sup3;/s.
          </p>
        </map-control-item>
        <map-control-item 
          name="Conductivity (µS)"
          type="cond">
          <div class="plot-container">
            <dot-plot
              .options="${conductivityDotPlotOptions}"
              .alldata="${this.alldata}"></dot-plot>
          </div>
          <p>
          Conductivity approximate the concentration of total dissolved solids in spring water. 
          The lowest spring water conductivity values are in the north-central and northwestern 
          parts of the state and the highest values are in southern and south-eastern Wisconsin.
          </p>
        </map-control-item>
      </div>
    `;
  }
}
customElements.define('map-controls', MapControls);

export class MapControlItem extends LitElement {
  static get properties() {
    return {
      name: {
        type: String
      },
      type: {
        type: String
      },
      selected: {
        type: Boolean,
        attribute: false
      }
    };
  }

  constructor() {
    super();
    this.genId = genId();
    this.selected = false;
  }

  static get styles() {
    return [
      ...styles,
      css`
    .icon {
      font-size: var(--icon-size-extra-large);
    }
    .icon[active] {
      color: var(--palette-active);
    }
    app-collapsible {
      --transition-duration: 0;
      --el-header-font-weight: var(--font-weight);
      --el-header-font-size: var(--font-size);
      --el-header-background: var(--palette-white);
      --el-border: 1px solid var(--palette-light);
    }
    [slot] {
      padding: var(--border-radius);
    }
    `];
  }

  render() {
    return html`
    <app-collapsible @open="${this.handleOpen}" .open=${this.selected}>
      <span slot="header-before">${this.name}</span>
      <i slot="header-after" 
        class="icon material-icons" 
        title="View on map"
        ?active=${this.selected}>map</i>
      <slot slot="content"></slot>
    </app-collapsible>
    `;
  }

  handleOpen(e) {
    if (this.selected !== e.detail.value) {
      dispatch(this.parentElement, CHANGE_EVENT, {
        type: this.type, 
        value: e.detail.value
      });
    }
  }

  handleSelect(e) {
    if (e.detail.type === this.type) {
      this.selected = e.detail.value;
      dispatch(document, STYLE_EVENT, {
        type: (this.selected)?this.type:RESET_TYPE
      });
    } else {
      this.selected = false;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.__selectHandler = this.handleSelect.bind(this);
    this.parentElement.addEventListener(CHANGE_EVENT, this.__selectHandler);
  }

  disconnectedCallback() {
    this.parentElement.removeEventListener(CHANGE_EVENT, this.__selectHandler);
    super.disconnectedCallback();
  }
}
customElements.define('map-control-item', MapControlItem);

export class LegendDot extends LitElement {
  static get properties() {
    return {
      alt: {
        type: Boolean
      }
    };
  }

  constructor() {
    super();
    this.alt = false;
  }

  static get styles() {
    return [
      ...styles,
      css`
        .svg-icon {
          display: inline-flex;
          align-self: center;
        }
        .svg-icon svg {
          top: calc(var(--line-height) / 5);
          position: relative;
        }
        svg {
          width: var(--font-size);
          height: var(--line-height);
        }
      `
    ];
  }

  render() {
    return html`
    <span class="svg-icon">
    <svg viewBox="-4 -12 16 22">
      <g>
        <path
          stroke="${this.color}"
          stroke-opacity="1"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="${this.color}"
          fill-opacity="0.2"
          fill-rule="evenodd"
          d="M0,0 a4,4 0 1,0 8,0 a4,4 0 1,0 -8,0">
        </path>
      </g>
    </svg>
  </span>
    `;
  }

  get color() {
    return (!this.alt)?'var(--map-symbol)':'var(--map-symbol-alt)';
  }
}
customElements.define('legend-dot', LegendDot);