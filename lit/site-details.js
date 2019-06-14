import { LitElement, html, css } from 'lit-element';
export { SitePhotos } from './site-photos.js';
export {SiteWaterQuality} from './site-water-quality.js'
export { SiteBedMaterials } from './site-bed-materials.js';
import { genId } from './gen-id.js';

export class SiteDetails extends LitElement {
  static get properties() {
    return {
      siteinfo: {
        type: Object
      },
      photos: {
        type: Array
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
    return css`
      [data-element="table"] {
        display: grid;
        grid-template-columns: 30% 70%;
        grid-gap: 0.5em;
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
    `;
  }

  render() {
    return html`
      <style>
        @import url("./css/typography.css");
      </style>

      ${(!this.siteinfo)? '' : html`
        <h1>${this.siteinfo.County} County Spring #${this.siteinfo.SpringID}</h1>
        <site-photos .photos="${this.photos}"></site-photos>
        <site-water-quality .siteinfo="${this.siteinfo}"></site-water-quality>
        <site-bed-materials .siteinfo="${this.siteinfo}"></site-bed-materials> 
        <div data-element="table">
          ${Object.entries(this.siteinfo).map((el, index) => html`
            <td class="label">
              <label for="${this.genId(index)}">${el[0]}</label>
            </td>
            <td class="detail">
              <span id="${this.genId(index)}">${el[1]}</span>
            </td>
          `)}
        </div>
      `}
    `;
  }
}
customElements.define('site-details', SiteDetails);