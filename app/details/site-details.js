import { LitElement, html, css } from 'lit-element';
import { genId } from 'wgnhs-common';
import { keyLookup, ignoredKeys } from '../site-data.js';
export { AppCollapsible } from 'wgnhs-layout';
export { SiteWaterQuality } from 'wgnhs-viz';
export { SiteBedMaterials } from 'wgnhs-viz';
import { styles } from 'wgnhs-styles';

export { SiteSketchButton } from './site-sketch.js';
export { SitePhotos } from './site-photos.js';

export class SiteDetails extends LitElement {
  static get properties() {
    return {
      siteinfo: {
        type: Object
      },
      photos: {
        type: Array
      },
      pdfpanel: {
        type: Object
      },
      pdfsrc: {
        type: String
      },
      printLayout: {
        type: Boolean,
        attribute: 'print-layout'
      }
    };
  }

  constructor() {
    super();
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

  static get styles() {
    return [
      ...styles,
      css`
      [data-element="table"] {
        display: grid;
        grid-template-columns: 30% 1fr;
        grid-gap: 0.5em;
        width: 100%;
      }

      td {
        padding: 0.5em;
      }

      .label {
        background-color: var(--palette-dark);
        font-weight: var(--font-weight-bold);
      }

      .detail {
        background-color: var(--palette-light);
      }

      .header {
        position: -webkit-sticky;
        position: sticky;
        top: 0px;
        background-color: var(--palette-white);
        padding: var(--font-size-extra-large) var(--border-radius);
        z-index: 10;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
      }
      .header h1 {
        padding: 0;
        max-width: 70%;
        text-align: center;
      }
      .header i {
        font-size: var(--icon-size-large);
        color: var(--palette-accent);
        cursor: pointer;
      }
      
      [data-closed] {
        display: none;
      }

      app-collapsible i {
        font-size: var(--icon-size-large);
      }

      app-collapsible i[slot="header-after"]::after {
        content: "expand_more";
      }

      app-collapsible[open] i[slot="header-after"]::after {
        content: "expand_less";
      }
    `];
  }

  get renderTable() {
    let key = 0, value = 1;
    return Object.entries(this.siteinfo).filter((el, index) => {
      return !ignoredKeys.includes(el[key]);
    }).map((el, index) => html`
    <td class="label" title="${(keyLookup[el[key]])?keyLookup[el[key]].desc:el[key]}">
      <label for="${this.genId(index)}" >
        ${(keyLookup[el[key]])?keyLookup[el[key]].title:el[key]}
      </label>
    </td>
    <td class="detail" title="${(keyLookup[el[key]])?keyLookup[el[key]].desc:el[key]}">
      <span id="${this.genId(index)}">
        ${(keyLookup[el[key]]&&keyLookup[el[key]].transform)?keyLookup[el[key]].transform(el[value]):el[value]}
      </span>
    </td>
  `)
  }

  render() {
    return html`
      ${(!this.siteinfo)? '' : html`
        <div class="header">
          <span>
            <a href="${window.router.link('view', this.siteinfo)}" onclick="event.preventDefault()"><i class="material-icons toggle-print" title="Back to website" @click="${this.fireTogglePrint}" ?data-closed="${!this.printLayout}">arrow_back</i></a>
            <a href="${window.router.link('entry')}" onclick="event.preventDefault()"><i class="material-icons clear-selection" title="Clear selection" @click="${this.fireClearSelection}" ?data-closed="${this.printLayout}">arrow_back</i></a>
          </span>
          <h1>${this.siteinfo.County} County Spring #${this.siteinfo.SpringID}</h1>
          <span>
            <a href="${window.router.link('print', this.siteinfo)}" onclick="event.preventDefault()"><i class="material-icons toggle-print" title="Print layout" @click="${this.fireTogglePrint}" ?data-closed="${this.printLayout}">zoom_out_map</i></a>
            <i class="material-icons print-action" title="Print this page" @click="${this.handlePrint}" ?data-closed="${!this.printLayout}">print</i>
          </span>
        </div>
        <site-photos .photos="${this.photos}" ?print-layout="${this.printLayout}"></site-photos>
        <site-sketch-button
          .panel=${this.pdfpanel}
          src="${this.pdfsrc}"></site-sketch-button>
        <app-collapsible open>
          <i slot="header-before" class="material-icons" title="Water quality">bar_chart</i>
          <span slot="header">Water quality</span>
          <i slot="header-after" class="material-icons"></i>
          <div slot="content">
            <site-water-quality .siteinfo="${this.siteinfo}"></site-water-quality>
          </div>
        </app-collapsible>
        <app-collapsible open>
          <i slot="header-before" class="material-icons" title="Spring-bed materials">bar_chart</i>
          <span slot="header">Spring-bed materials</span>
          <i slot="header-after" class="material-icons"></i>
          <div slot="content">
            <site-bed-materials .siteinfo="${this.siteinfo}"></site-bed-materials> 
          </div>
        </app-collapsible>
        <app-collapsible .open="${this.printLayout}">
          <i slot="header-before" class="material-icons" title="All data">view_list</i>
          <span slot="header">All data</span>
          <i slot="header-after" class="material-icons"></i>
          <div slot="content" data-element="table">
            ${this.renderTable}
          </div>
        </app-collapsible>
      `}
    `;
  }

  handlePrint() {
    window.print();
  }

  fireClearSelection() {
    let event = new CustomEvent('clear-selection', {
      bubbles: true,
      detail: {}
    });
    this.dispatchEvent(event);
  }
  fireTogglePrint() {
    let event = new CustomEvent('toggle-print', {
      bubbles: true,
      detail: {
        on: !this.printLayout,
        params: this.siteinfo
      }
    });
    this.dispatchEvent(event);
  }
}
customElements.define('site-details', SiteDetails);
