import { LitElement, html, css } from 'lit-element';
export * from 'macro-carousel'

export class SitePhotos extends LitElement {
  static get properties() {
    return {
      photos: Array
    };
  }

  constructor() {
    super();
  }

  static get styles() {
    return css`
      macro-carousel {
        padding: 0 3em;
      }
      .slide {
        min-height: 10em;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .slide img {
        max-height: 20em;
      }
    `;
  }

  render() {
    return html`
    ${(!this.photos)?'': html`
    <macro-carousel navigation pagination>
    <slot>
      ${this.photos.map((el) => html`
      <div class="slide">
        <img src="${el}" />
      </div>
      `)}
    </slot>
    </macro-carousel>
    `}
    `;
  }
}
customElements.define('site-photos', SitePhotos);