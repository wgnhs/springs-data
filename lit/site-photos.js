import { LitElement, html, css } from 'lit-element';
export * from 'macro-carousel';
export { ModalDialog } from './modal-dialog.js';

export class SitePhotos extends LitElement {
  static get properties() {
    return {
      photos: Array,
      clickedImg: {
        type: String,
        attribute: false
      }
    };
  }

  constructor() {
    super();
  }

  static get styles() {
    return css`
      macro-carousel {
        padding: 0 3em;
        max-width: 75vw;
        margin: 0 auto;
      }
      .slide {
        min-height: 40vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .slide img {
        max-height: 40vh;
      }
      .text {
        background-color: var(--palette-accent-transparent);
        color: var(--palette-white);
        position: absolute;
        left: 0;
        width: 100%;
      }
      .text p {
        margin: 0 1em;
      }
      .title {
        top: 0;
      }
      .caption {
        bottom: 0;
        max-height: calc(var(--line-height) * 3);
        overflow: hidden;
      }
    `;
  }

  render() {
    return html`
    ${(!this.photos)?'':html`
    <macro-carousel navigation pagination>
    <slot>
      ${this.photos.map((el) => (!el.FileURL)?'':html`
      <div class="slide">
        <img 
          src="${el.FileURL}"
          alt="${el.Description}"
          @dblclick="${this.handleImageClick}"
        />

        ${(!el.Image_Number)?'':html`
        <div class="title text">
          <p>
            PP${el.Image_Number}
          </p>
        </div>
        `}

        ${(!el.Description)?'':html`
        <div class="caption text">
          <p>
            ${el.Description}
          </p>
        </div>
        `}
      </div>
      `)}
    </slot>
    </macro-carousel>
    <modal-dialog></modal-dialog>
    `}
    `;
  }

  firstUpdated() {
    this.$modal = this.renderRoot.querySelector('modal-dialog');
  }

  handleImageClick(e) {
    this.clickedImg = e.target.src;
    this.$modal.source = this.clickedImg;
    this.$modal.toggleOpen();
  }
}
customElements.define('site-photos', SitePhotos);