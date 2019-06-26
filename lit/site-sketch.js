import { LitElement, html, css } from 'lit-element';

let pdfjsLib = window['pdfjs-dist/build/pdf'];

export class SiteSketch extends LitElement {
  static get properties() {
    return {
      pdfsrc: {
        type: String
      },
      imgsrc: {
        type: String
      }
    };
  }

  buildImgSrc() {
    if (this.pdfsrc) {
      let renderRoot = this.renderRoot;
      let cleanedUrl = this.pdfsrc.replace('http://data.wgnhs.uwex.edu/', 'https://data.wgnhs.wisc.edu/');
      // console.log(this.pdfsrc, cleanedUrl);
      let canvasEl = document.createElement('canvas');
      let loadingTask = pdfjsLib.getDocument(cleanedUrl);
      return loadingTask.promise.then(function(pdf) {
        // console.log('PDF Loaded');
        var pageNumber = 1;
        return pdf.getPage(pageNumber).then(function(page) {
          // console.log('Page loaded');
          
          var scale = 1.0;
          var viewport = page.getViewport({scale: scale});

          // Prepare canvas using PDF page dimensions
          var canvas = canvasEl;
          var context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // Render PDF page into canvas context
          var renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          var renderTask = page.render(renderContext);
          return renderTask.promise.then(function () {
            // console.log('Page rendered');
            let durl = canvasEl.toDataURL();
            return durl;
          });
        });
      }, function (reason) {
        console.error(reason);
      });
    }
    return Promise.resolve(null);
  }

  constructor() {
    super();
  }

  static get styles() {
    return css`
      div {
        min-height: 10em;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      img {
        max-height: 70vh;
      }
    `;
  }

  render() {
    return html`
    <div>
      ${(!this.imgsrc)?'':html`
      <img src="${this.imgsrc}" />
      `}
    </div>
    `;
  }

  updated(old) {
    var el = this;
    if (old.has('pdfsrc')) {
      if (el.pdfsrc) {
        el.buildImgSrc().then(function(url) {
          el.imgsrc = url;
        })
      } else {
        el.imgsrc = null;
      }
    }
  }
}
customElements.define('site-sketch', SiteSketch);

export class SiteSketchPanel extends LitElement {
  static get properties() {
    return {

    };
  }

  constructor() {
    super();
  }

  static get styles() {
    return css`
    div {
      min-height: 10em;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    `;
  }

  render() {
    return html`
    <div>
      <slot></slot>
    </div>
    `;
  }

  handleSketchToggle(e) {
    if (e.detail.closed) {
      this.setAttribute('data-closed', true);
    } else {
      this.removeAttribute('data-closed');
    }
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('toggle-sketch', this.handleSketchToggle.bind(this));
  }

  disconnectedCallback() {
    document.removeEventListener('toggle-sketch', this.handleSketchToggle.bind(this));
    super.disconnectedCallback();
  }
}
customElements.define('site-sketch-panel', SiteSketchPanel);

export class SiteSketchButton extends LitElement {
  static get properties() {
    return {
      buttonText: String,
    };
  }

  constructor() {
    super();
    this.closed=true;
    this.buttonText="Show Sketch";
  }

  static get styles() {
    return css`
    `;
  }

  render() {
    return html`
    <button @click="${this.toggle}">${this.buttonText}</button>
    `;
  }

  toggle() {
    this.closed = !this.closed;
    this.buttonText = (this.closed)?"Show Sketch":"Hide Sketch";
    this.dispatchEvent(new CustomEvent('toggle-sketch', {bubbles: true, detail: {closed: this.closed}}));
  }
}
customElements.define('site-sketch-button', SiteSketchButton);