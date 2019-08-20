(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lit-element'), require('wgnhs-common')) :
  typeof define === 'function' && define.amd ? define(['exports', 'lit-element', 'wgnhs-common'], factory) :
  (global = global || self, factory(global.lit = {}, global.common, global.common));
}(this, function (exports, litElement, wgnhsCommon) { 'use strict';

  class DownloadSection extends litElement.LitElement {
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
      return litElement.css`
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
    `;
    }

    render() {
      return litElement.html`
    <style>
      @import url("./css/typography.css");
    </style>
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

  class InRadio extends litElement.LitElement {
    static get properties() {
      return {
        inName: {
          type: String,
          attribute: 'in-name'
        },
        choices: {
          type: Array
        },
        choice: {
          type: String,
          reflect: true
        }
      };
    }

    constructor() {
      super();
      this.checked = [];
      this.genId = (function() {
        const memo = {};
        return function(index) {
          if (!memo[index]) {
            memo[index] = wgnhsCommon.genId();
          }
          return memo[index];
        }
      })();
    }

    firstUpdated() {
      if (!this.choice && this.choices) {
        this.choice = this.choices[0];
      }
    }

    inChange(e) {
      this.choice = e.target.value;

      let event = new CustomEvent('choice-change', {
        detail: {
          choice: this.choice
        }
      });
      this.dispatchEvent(event);
    }

    render() {
      return litElement.html`
      ${this.choices.map((item, index) => litElement.html`
        <div class="choice">
          <input 
            type="radio" 
            name="${this.inName}" 
            id="${this.genId(index)}" 
            value="${item}" 
            .checked="${(this.choice === item)}" 
            @change="${this.inChange}"
          >
          <label for="${this.genId(index)}">${item}</label>
        </div>
      `)}
    `;
    }
  }
  customElements.define('in-radio', InRadio);

  /**
   * Code use and modified from
   * https://alligator.io/css/collapsible/
   */
  class AppCollapsible extends litElement.LitElement {
    static get properties() {
      return {
        genId: {
          type: String,
          attribute: false
        },
        open: {
          type: Boolean,
          reflect: true
        },
        button: {
          type: Boolean
        }
      };
    }

    constructor() {
      super();
      this.genId = wgnhsCommon.genId();
    }

    static get styles() {
      return litElement.css`
    .wrap-collapsible {
      margin: var(--border-radius) 0;
    }

    input[type='checkbox'] {
      display: none;
    }

    .lbl-toggle {
      display: block;

      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-extra-large);
      text-align: center;

      padding: var(--border-radius);

      color: var(--palette-accent);
      background: var(--palette-light);

      cursor: pointer;

      border-radius: var(--border-radius);
      transition: all 0.3s cubic-bezier(0.755, 0.05, 0.855, 0.06);
    }

    .lbl-toggle:hover {
      color: var(--palette-900);
    }

    .lbl-toggle:focus {
      outline: thin dotted;
    }

    .collapsible-content {
      max-height: 0px;
      overflow: hidden;
      transition: max-height 0.3s cubic-bezier(0.86, 0, 0.07, 1);
    }

    .wrap-collapsible:not([button]) .toggle:checked ~ .collapsible-content {
      max-height: var(--collapsible-max-height, 3000px);
    }

    .wrap-collapsible:not([button]) .toggle:checked ~ .lbl-toggle {
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      transition: border 0s;
    }

    .collapsible-content .content-inner {
      background: var(--palette-white);
      border-bottom: 1px solid var(--palette-light);
      border-right: 1px solid var(--palette-light);
      border-left: 1px solid var(--palette-light);
      border-bottom-left-radius: var(--border-radius);
      border-bottom-right-radius: var(--border-radius);
      padding: var(--font-size);
    }
    .collapsible-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    `;
    }

    render() {
      return litElement.html`
    <div class="wrap-collapsible" ?button=${this.button}>
      <input id="${this.genId}" class="toggle" type="checkbox" ?checked="${this.open}" @change=${this._handleChange}>
      <label for="${this.genId}" class="lbl-toggle" tabindex="0">
        <div class="collapsible-header">
          <div><slot name="header-before"></slot></div>
          <div><slot name="header"></slot></div>
          <div><slot name="header-after"></slot></div>
        </div>
      </label>
      <div class="collapsible-content">
        <div class="content-inner">
          <slot name="content"></slot>
        </div>
      </div>
    </div>
    `;
    }

    firstUpdated() {
      let myLabels = this.renderRoot.querySelectorAll('.lbl-toggle');

      Array.from(myLabels).forEach(label => {
        label.addEventListener('keydown', e => {
          // 32 === spacebar
          // 13 === enter
          if (e.which === 32 || e.which === 13) {
            e.preventDefault();
            label.click();
          }      });
      });
    }

    updated(changed) {
      let eventName = 'open';
      if (changed.has(eventName)) {
        wgnhsCommon.dispatch(this, eventName, { value: this[eventName] });
      }
    }

    _handleChange(e) {
      this.open = e.target.checked;
    }
  }
  customElements.define('app-collapsible', AppCollapsible);

  class AppSidebar extends litElement.LitElement {
    static get properties() {
      return {
        title: {
          type: String
        }
      };
    }

    constructor() {
      super();
    }

    static get styles() {
      return litElement.css`
      :host {
        padding: 0 var(--border-radius);
      }
    `;
    }

    switchTab(choice) {
      this.shadowRoot.querySelectorAll('slot').forEach((el) => {
        if ((choice === 'default' && !el.getAttribute('name')) || (el.getAttribute('name') === choice)) {
          el.hidden = false;
        } else {
          el.hidden = true;
        }
      });
    }

    handleChoiceChange(e) {
      this.switchTab(e.detail.choice);
    }

    render() {
      return litElement.html`
      <style>
        @import url("./css/typography.css");
      </style>

      ${(!this.title)?'':litElement.html`<h1 class="header">${this.title}</h1>`}
      <slot></slot>
      <slot name="details" hidden></slot>
    `;
    }
  }

  customElements.define('app-sidebar', AppSidebar);

  class ModalDialog extends litElement.LitElement {
    static get properties() {
      return {
        open: {
          type: Boolean,
          attribute: 'open-modal',
          reflect: true
        },
        source: {
          type: String
        }
      };
    }

    constructor() {
      super();
      this.open = false;
    }

    static get styles() {
      return litElement.css`
      .modal {
        position: fixed;
        background: var(--palette-accent-transparent);
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: var(--z-index-interrupt);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .modal-window {
        position: relative;
        padding: 0.5em;
        border-radius: var(--border-radius);
        background: var(--palette-light);
      }
      .modal-content {
        max-height: 90vh;
        max-width: 90vw;
      }
      .modal-close {
        position: absolute;
        top: 0;
        right: 0;
        border-radius: var(--border-radius);
      }
      [data-closed] {
        display: none;
      }
    `;
    }

    render() {
      return litElement.html`
      <style>
        @import url("./css/typography.css");
      </style>
      <div class="modal b-close-modal" role="dialog" aria-hidden="true" ?data-closed="${!this.open}" @click="${this.handleClick}">
        <div class="modal-window">
            <button class="modal-close b-close-modal">X</button>
            ${(!this.source)?'':litElement.html`
              <img class="modal-content" src="${this.source}" />
            `}
        </div>
      </div>
    `;
    }

    toggleOpen() {
      this.open = !this.open;
    }

    handleClick(e) {
      if (e.target.classList.contains('b-close-modal')) {
        this.toggleOpen();
      }
    }
  }
  customElements.define('modal-dialog', ModalDialog);

  /*
   * Code from https://github.com/lukehaas/css-loaders
  The MIT License (MIT)

  Copyright (c) 2014 Luke Haas

  Permission is hereby granted, free of charge, to any person obtaining a copy of
  this software and associated documentation files (the "Software"), to deal in
  the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
  the Software, and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
  FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
  COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
  IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  class AppSpinner extends litElement.LitElement {
    static get properties() {
      return {

      };
    }

    constructor() {
      super();
    }

    static get styles() {
      return litElement.css`
    .loader {
      color: var(--palette-900);
      font-size: 90px;
      text-indent: -9999em;
      overflow: hidden;
      width: 1em;
      height: 1em;
      border-radius: 50%;
      margin: 72px auto;
      position: relative;
      -webkit-transform: translateZ(0);
      -ms-transform: translateZ(0);
      transform: translateZ(0);
      -webkit-animation: load6 1.7s infinite ease, round 1.7s infinite ease;
      animation: load6 1.7s infinite ease, round 1.7s infinite ease;
    }
    @-webkit-keyframes load6 {
      0% {
        box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
      }
      5%,
      95% {
        box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
      }
      10%,
      59% {
        box-shadow: 0 -0.83em 0 -0.4em, -0.087em -0.825em 0 -0.42em, -0.173em -0.812em 0 -0.44em, -0.256em -0.789em 0 -0.46em, -0.297em -0.775em 0 -0.477em;
      }
      20% {
        box-shadow: 0 -0.83em 0 -0.4em, -0.338em -0.758em 0 -0.42em, -0.555em -0.617em 0 -0.44em, -0.671em -0.488em 0 -0.46em, -0.749em -0.34em 0 -0.477em;
      }
      38% {
        box-shadow: 0 -0.83em 0 -0.4em, -0.377em -0.74em 0 -0.42em, -0.645em -0.522em 0 -0.44em, -0.775em -0.297em 0 -0.46em, -0.82em -0.09em 0 -0.477em;
      }
      100% {
        box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
      }
    }
    @keyframes load6 {
      0% {
        box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
      }
      5%,
      95% {
        box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
      }
      10%,
      59% {
        box-shadow: 0 -0.83em 0 -0.4em, -0.087em -0.825em 0 -0.42em, -0.173em -0.812em 0 -0.44em, -0.256em -0.789em 0 -0.46em, -0.297em -0.775em 0 -0.477em;
      }
      20% {
        box-shadow: 0 -0.83em 0 -0.4em, -0.338em -0.758em 0 -0.42em, -0.555em -0.617em 0 -0.44em, -0.671em -0.488em 0 -0.46em, -0.749em -0.34em 0 -0.477em;
      }
      38% {
        box-shadow: 0 -0.83em 0 -0.4em, -0.377em -0.74em 0 -0.42em, -0.645em -0.522em 0 -0.44em, -0.775em -0.297em 0 -0.46em, -0.82em -0.09em 0 -0.477em;
      }
      100% {
        box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
      }
    }
    @-webkit-keyframes round {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
    @keyframes round {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
    `;
    }

    render() {
      return litElement.html`
      <div class="loader">Loading...</div>
    `;
    }
  }
  customElements.define('app-spinner', AppSpinner);

  class ButtonLink extends litElement.LitElement {
    static get properties() {
      return {
        href: {
          type: String
        },
        target: {
          type: String
        },
        download: {
          type: Boolean
        }
      };
    }

    constructor() {
      super();
    }

    static get styles() {
      return litElement.css`
    a {
      text-decoration: none;
      margin: var(--border-radius) 0;
    }
    .button-link:hover {
      color: var(--palette-900);
    }
    .button-link:focus {
      outline: thin dotted;
    }
    .button-link {
      display: block;

      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-extra-large);
      text-align: center;

      cursor: pointer;
      text-align: center;
      background: var(--palette-light);
      color: var(--palette-accent);
      border-radius: var(--border-radius);
      padding: var(--border-radius);
    }
    .wrap-content {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    .icon {
      font-size: var(--icon-size-extra-large);
    }
    `;
    }

    render() {
      return litElement.html`
    <a class="button-link"
      href="${this.href}"
      target="${this.target}"
      ?download=${this.download}>
      <div class="wrap-content">
        <div><slot name="content-before"></slot></div>
        <div><slot name="content"></slot></div>
        <div><slot name="content-after"></slot></div>
      </div>
    </a>
    `;
    }
  }
  customElements.define('button-link', ButtonLink);

  const pdfjsLib = window['pdfjs-dist/build/pdf'];

  const TOGGLE_EVENT = 'toggle-pdf-panel';

  class PDFRenderer {
    render(url) {
      if (url) {
        let canvasEl = document.createElement('canvas');
        let loadingTask = pdfjsLib.getDocument(url);
        return loadingTask.promise.then(function(pdf) {
          // console.log('PDF Loaded');
          var pageNumber = 1;
          return pdf.getPage(pageNumber);
        }).then(function(page) {
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
          return renderTask.promise;
        }).then(function () {
          // console.log('Page rendered');
          let durl = canvasEl.toDataURL();
          return durl;
        });
      }
      return Promise.reject(null);
    }
  }

  class PDFViewPanel extends litElement.LitElement {
    static get properties() {
      return {
        pdfsrc: {
          type: String,
          attribute: false
        },
        rotate: {
          type: Number
        },
        zoom: {
          type: Number
        }
      };
    }

    constructor() {
      super();
      this.cache = {};
      this.renderer = new PDFRenderer();
      this.rotate = 0;
      this.zoom = 1;
    }

    static get styles() {
      return litElement.css`
    :host {
      overflow: auto;
    }
    .container {
      min-height: 10em;
      display: grid;
      grid-column-template: 1fr;
      grid-gap: var(--border-radius);
      justify-content: center;
    }
    .content {
      max-width: 45vw;
    }
    .controls {
      display: grid;
      grid-column-template: 1fr;
      grid-gap: var(--border-radius);
      position: absolute;
      top: 0;
      right: var(--border-radius);
      margin: var(--border-radius);
      z-index: 10;
    }
    .control {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: var(--icon-size-large);
      color: var(--palette-accent);
      text-align: center;
      cursor: pointer;
      padding: var(--border-radius);
      background-color: var(--palette-light);
      border: none;
      border-radius: 50%;
    }
    [data-closed] {
      display: none;
    }
    `;
    }

    render() {
      return litElement.html`
    <style>
      @import url("./css/typography.css");
    </style>
    <div class="controls">
      <button class="control" @click=${this.hide}><i class="material-icons" title="Hide">close</i></button>
      <button class="control" @click=${this.zoomIn} ?disabled=${this.isMaxZoom}><i class="material-icons" title="Zoom In">zoom_in</i></button>
      <button class="control" @click=${this.zoomOut} ?disabled=${this.isMinZoom}><i class="material-icons" title="Zoom Out">zoom_out</i></button>
      <button class="control" @click=${this.rotateLeft}><i class="material-icons" title="Rotate Left">rotate_left</i></button>
      <button class="control" @click=${this.rotateRight}><i class="material-icons" title="Rotate Right">rotate_right</i></button>
    </div>
    <app-spinner ?data-closed=${this.imgsrc}></app-spinner>
    <div class="container" ?data-closed=${!this.imgsrc}>
      ${this.imageTag}
      <slot></slot>
    </div>
    `;
    }

    get imgsrc() {
      return this.cache[this.pdfsrc];
    }

    static get MOD_ROTATE() {
      return 4;
    }

    get rotate() {
      return this._rotate;
    }
    set rotate(val) {
      const old = this.rotate;
      let rot = Math.round(val) + PDFViewPanel.MOD_ROTATE;
      this._rotate = (rot % PDFViewPanel.MOD_ROTATE);
      this.requestUpdate('rotate', old);
    }

    rotateLeft() {
      this.rotate -= 1;
    }
    rotateRight() {
      this.rotate += 1;
    }

    static get MAX_ZOOM() {
      return 2;
    }
    get isMaxZoom() {
      return this.zoom >= PDFViewPanel.MAX_ZOOM;
    }

    static get MIN_ZOOM() {
      return 0.5;
    }
    get isMinZoom() {
      return this.zoom <= PDFViewPanel.MIN_ZOOM;
    }

    get zoom() {
      return this._zoom;
    }
    set zoom(val) {
      const old = this.zoom;
      this._zoom = Math.min(Math.max(val, PDFViewPanel.MIN_ZOOM), PDFViewPanel.MAX_ZOOM);
      this.requestUpdate('zoom', old);
    }

    zoomIn() {
      this.zoom += 0.25;
    }
    zoomOut() {
      this.zoom -= 0.25;
    }

    get translate() {
      let result = {
        x: 0,
        y: 0
      };
      if (this.rotate) {
        result.x = (this.rotate === 1)? 0 : (100 * this.zoom);
        result.y = (this.rotate === 3)? 0 : (100 * this.zoom);
      }
      return result;
    }

    get imageTag() {
      return (!this.imgsrc)?'':litElement.html`
    <img class="content"
      src="${this.imgsrc}"
      style="${this.contentTransform}" />
    `;
    }

    get contentTransform() {
      let rot = this.rotate / PDFViewPanel.MOD_ROTATE;
      let zoom = this.zoom;
      let fix = this.translate;
      let result = `
      transform-origin: top left;
      transform: rotate(${rot}turn) translate(-${fix.x}%, -${fix.y}%) scale(${zoom})
      `;

      return result;
    }

    show(url) {
      // console.log('show', url);
      this.dispatchEvent(new CustomEvent(TOGGLE_EVENT,
        {bubbles: true, composed: true, detail: {url, closed: false}}));
      this.pdfsrc = url;
      this.removeAttribute('data-closed');
    }

    hide() {
      // console.log('hide');
      this.pdfsrc = null;
      this.setAttribute('data-closed', true);
      this.dispatchEvent(new CustomEvent(TOGGLE_EVENT,
        {bubbles: true, composed: true, detail: {closed: true}}));
    }

    _getFromCache(url) {
      return new Promise((resolve, reject) => {
        let result = this.cache[url];
        if (result) {
          resolve(result);
        } else {
          reject('Not in cache');
        }
      });
    }

    request(url) {
      // console.log('request', url);
      return this._getFromCache(url).catch(() => {
        return this.renderer.render(url).then((value) => {
          this.cache[url] = value;
          this.requestUpdate('cache');
          return value;
        });
      });
    }

  }
  customElements.define('pdf-view-panel', PDFViewPanel);

  class PDFViewButton extends litElement.LitElement {
    static get properties() {
      return {
        src: {
          type: String
        },
        panel: {
          type: Object,
          attribute: false
        },
        missing: {
          type: Boolean,
          attribute: false
        }
      };
    }

    constructor() {
      super();
      this.missing = true;
      this.alt = false;
    }

    static get styles() {
      return litElement.css`
    .container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: var(--border-radius);
    }

    [data-closed] {
      display: none;
    }
    `;
    }

    render() {
      return litElement.html`
    <style>
      @import url("./css/typography.css");
    </style>
    <div class="container" ?data-closed=${this.missing}>
      <button-link href="${this.src}" target="_blank" download>
        <i slot="content-before" class="material-icons" title="Download">save_alt</i>
        <span slot="content">Download</span>
      </button-link>
      <app-collapsible @open="${this.toggle}" button>
        <span slot="header">View</span>
        <i slot="header-after" class="material-icons" title="View">${
          (this.alt)?'chevron_left':'chevron_right'
        }</i>
      </app-collapsible>
    </div>
    `;
    }

    updated(prev) {
      if ((prev.has('panel') || prev.has('src'))) {
        this.handleMissingPDF();
        if (this.panel && this.src) {
          this.panel.request(this.src)
            .then(this.handleLoadedPDF.bind(this), this.handleMissingPDF.bind(this));
        }
      }
    }

    toggle(e) {
      if (this.alt) {
        this.panel.hide();
      } else {
        this.panel.show(this.src);
      }
    }

    handleMissingPDF() {
      if (!this.missing) {
        this.missing = true;
      }
    }

    handleLoadedPDF() {
      if (this.missing) {
        this.missing = false;
      }
    }

    handleAlt(e) {
      if (e.detail.url === this.src) {
        this.alt = true;
      } else {
        this.alt = false;
      }
      this.requestUpdate();
    }

    connectedCallback() {
      super.connectedCallback();
      this.__altHandler = this.handleAlt.bind(this);
      document.addEventListener(TOGGLE_EVENT, this.__altHandler);
    }

    disconnectedCallback() {
      document.removeEventListener(TOGGLE_EVENT, this.__altHandler);
      super.disconnectedCallback();
    }
  }
  customElements.define('pdf-view-button', PDFViewButton);

  class SiteBedMaterials extends litElement.LitElement{
      static get properties(){
          return {
              siteinfo: Object
          };
      }

      constructor() {
          super();
      }

      static get styles(){
          return litElement.css`
        :host {

        }
        text {
            font-size: var(--font-size-small);
            font-weight: bold;
            fill: #414c43;

        }
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .donutSegments {

        }
        .chartLabels {

        }
        .leaderLines {

        }
        `;
      }


      render() {

          return litElement.html `
        <div class="container">
        <!-- <h2>Spring-bed materials</h2> -->
        <svg id="bed-materials-chart"></svg>
        </div>
        `;

      }

      firstUpdated() {
          this.chart = d3.select(this.renderRoot.querySelector('#bed-materials-chart'));
      }

      updated() {

          var width = 500;
          var height = 300;
          var margin = 15; //space between the circle and the edge of the SVG
          var radius = (Math.min(width, height) / 2) - (margin * 2); //outer radius of the circle


          /* ~~~~~~~~~ SVG SETUP ~~~~~~~~~ */

          this.chart.attr("width", width).attr("height", height);

          // set up groups within the svg:
          var masterGroup = this.chart.append("g").attr("transform", "translate("+width/2+","+height/2+")"); //append a group and move it to the center of the SVG.
          var donutGroup = masterGroup.append("g").attr("class", "donutSegments");
          var labelGroup = masterGroup.append("g").attr("class", "chartLabels");
          var linesGroup = masterGroup.append("g").attr("class", "leaderLines");


          /* ~~~~~~~~~ DATA ~~~~~~~~~ */

          var values = [
              {material: "organic", percent: this.siteinfo.Percent_organic, color: "#406058"},
              {material: "fines", percent: this.siteinfo.Percent_fines, color: "#adcaba"},
              {material: "sand", percent: this.siteinfo.Percent_sand, color: "#b7b098"},
              {material: "gravel", percent: this.siteinfo.Percent_gravel, color: "#cccccc"},
              {material: "cobble", percent: this.siteinfo.Percent_cobble, color: "#7b6888"},
              {material: "boulder", percent: this.siteinfo.Percent_boulder, color: "#514b47"},
              {material: "bedrock", percent: this.siteinfo.Percent_bedrock, color: "#98abc5"}
          ];

          //process the data array for use in the donut chart...
           var pie = d3.pie()
                      .sort(null)             // do not sort by size
                      .value(function(d){     // set the value that is used to size each pie chart segment
                          return d.percent    // the data attribute that gives the charted value for each segment
                      })(values);             // call this function, giving it the values array

          // the pie function returns an array of objects representing the segments, containing their the start and end angles, data value, etc.


          // the pie function always returns 7 objects. filter it down to only the objects with a percent value greater than zero, so we are not going to draw any 0-dimension paths.
          var filterpie = pie.filter(function(el){return el.value > 0;});

          //console.log("filtered pie is ", filterpie);

          /* ~~~~~~~~~ DONUT SEGMENTS ~~~~~~~~~ */
          // right now, the website is set up so that it re-renders everything in the side panel when a each spring is queried.
          // therefore, everything is cleared and re-generated with each query.
          // this code could be designed differently if more dynamic updating were required.


          //define the properties of a donut arc.
          var arc = d3.arc()
                      .outerRadius(radius)
                      .innerRadius(radius - 45)   //lower numbers here make a thinner ring
                      .padAngle(0.025);              //about 0.025 is a good visible gap.


          donutGroup.selectAll("path")                            // we are using all paths within the group
              .data(filterpie)                                          // we want to use the data as processed by the pie function. this returns the update selection, which includes all data values that have corresponding DOM elements.
              .enter()                                            // enter is a selection with placeholders for each data value (datum) that lacks a corresponding DOM element.
              .append("path")                                     // for any datum missing a DOM element, create one of these.
              .attr("d", arc)                                     //
              .attr("fill", function(d){return (d.data.color);})  // apply fill color, which is a function of the color data attribute.
              .style("opacity", 1)                                // apply any styles for the donut chart segments
              ;


          /* ~~~~~~~~~~ LABELS ~~~~~~~~~~~ */

           // calculates the angle for the middle of a slice
          function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }

          // arc for positioning labels; won't be drawn.
          var outerArc = d3.arc()
                          .innerRadius(radius * 1.1)
                          .outerRadius(radius * 1.1);




          var label = this.chart.select(".chartLabels").selectAll("text")
              .data(filterpie)
              .enter()
              .append('text')
              .html(function(d){ return d.data.percent+"% "+d.data.material; })   // build the content of the label
              .attr('dy', '.35em')                                                //vertical alignment
              .attr("transform", function(d){

                      var anchorpoint = outerArc.centroid(d);                             // initially, set the anchorpoint of text to be where the bisecting angle meets the outer arc
                      anchorpoint[0] = radius * 1.15 * (midAngle(d) < Math.PI ? 1 : -1);  // then shift the anchorpoint on the x axis.
                      // changes the point to be on left or right depending on where label is (multiply by 1 or by -1).

                      return 'translate('+anchorpoint+')';
              })
              .style('text-anchor', function(d){
                      // if slice centre is on the left, anchor text to start, otherwise anchor to end
                      return (midAngle(d)) < Math.PI ? 'start' : 'end';
              })
              ;


          /* ~~~~~~~~~ LEADER LINES ~~~~~~~~~ */
          var polyline = this.chart.select(".leaderLines").selectAll('polyline')
              .data(filterpie)
              .enter()
              .append('polyline')
              .attr('stroke', "#333333")      //set appearance
              .attr("stroke-width", 1)        //set appearance
              .style('fill', 'none')          //set appearance
              .attr('points', function(d){

                  // three points on each line:
                  // A: centroid of the donut segment
                  // B: where the bisecting angle meets the outer arc (breakpoint in the line)
                  // C: outer endpoint at the same y position as B, but with x coordinate near the side of the SVG

                  var endpoint = outerArc.centroid(d);                            // initially, set the endpoint (C) to point B.
                  endpoint[0] = radius * 1.1 * (midAngle(d) < Math.PI ? 1 : -1);  // then shift point C on the x axis.

                  return [arc.centroid(d), outerArc.centroid(d), endpoint]        // return A, B, and C
              })
              ;

      } //close updated method.
  } //close export
  customElements.define('site-bed-materials', SiteBedMaterials);

  class SiteWaterQuality extends litElement.LitElement {
    static get properties() {
      return {
          siteinfo: Object
      };
    }

    constructor() {
      super();
    }
      static get styles(){
          return litElement.css`
            .label{
               font-weight: bold;
            }
            .tick {
               font-size: 13px;

               /* why did I have to add this in?? */
               font-family: 'open_sansregular','Open Sans',sans_serif; 

               color: #777;
            }
            .tick line {
               stroke: #777;
            }
            .annotation {
               font-size: 14px;
            }

            .container {
               display: flex;
               flex-direction: column;
               align-items: center;
            }
        `; 
      }

    render() {
      return litElement.html`
        <div class="container">
        <!-- <h2>Water quality</h2> -->
        
       <!-- <span class="label">conductivity: </span><span>${this.siteinfo.Conductivity_uS}</span><br> -->
         <svg id="conductivity-chart"></svg><br>
       <!-- <span class="label">temperature: </span><span>${this.siteinfo.Water_Temp_C}</span><br> -->
         <svg id="temperature-chart"></svg><br>
       <!-- <span class="label">pH: </span><span>${this.siteinfo.pH}</span><br> -->
         <svg id="ph-chart"></svg>
        </div>
    `;
    } //end render 
      
     firstUpdated() {
        this.phchart = d3.select(this.renderRoot.querySelector('#ph-chart'));
        this.temperaturechart = d3.select(this.renderRoot.querySelector('#temperature-chart'));
        this.conductivitychart = d3.select(this.renderRoot.querySelector('#conductivity-chart'));
     }
     
     updated() {
              
        var siteph = [{pH:this.siteinfo.pH}];
        var siteWaterTemp = [{Water_Temp_C: this.siteinfo.Water_Temp_C}];
        var siteConductivity = [{Conductivity_uS: this.siteinfo.Conductivity_uS}];
        
        
        
        /* ~~~~~~~~~ SVG SETUP ~~~~~~~~~ */
        var svgWidth = 400;
        
        var phDotPlotOptions = {
           svg: this.phchart, 
           label: "pH",         
           attributeKey: "pH", 

           tickValues:[5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0], 
           chartMin: 5.5, 
           chartMax: 10,
           
           svgWidth: svgWidth,
           siteInfo: this.siteinfo,
           allData:  aggrData.data 
           
        };
        
        var tempDotPlotOptions = {
           svg: this.temperaturechart, 
           label: "Temperature (C)",
           attributeKey: "Water_Temp_C", 
           
           tickValues:[5,7,9,11,13,15,17], 
           chartMin: 5, 
           chartMax: 17,
           
           svgWidth: svgWidth,
           siteInfo: this.siteinfo, 
           allData:  aggrData.data
           
        }; 
        
        var conductivityDotPlotOptions = {
           svg: this.conductivitychart,
           label: "Conductivity (uS)", 
           attributeKey: "Conductivity_uS", 
           
           tickValues:[0, 250, 500, 750, 1000, 1250, 1500, 1750], 
           chartMin: 0, 
           chartMax: 1750,
           
           svgWidth: svgWidth,
           siteInfo: this.siteinfo,
           allData:  aggrData.data
        
        };
        
        dotPlot.draw(tempDotPlotOptions);
        dotPlot.draw(phDotPlotOptions);
        dotPlot.draw(conductivityDotPlotOptions);
        
     }  //end updated() 
      
  }   //end export class

  customElements.define('site-water-quality', SiteWaterQuality);




  // dotPlot is an immediately-invoked function expression. 

  var dotPlot = (function (){
     
     // define functions that will be methods of dotPlot 
     
     var draw = function(options){ 
        
        // console.log("draw dot plot ranging from "+options.chartMin+" to "+options.chartMax+" with the value "+options.siteInfo[options.attributeKey]+" annotated. ");
        
        /* ---- SVG setup ---- */
        
        var svgHeight = 110;
        var svgWidth = options.svgWidth;
        var margin = {
                       top: 40,
                       right: 20,
                       bottom: 40,
                       left: 20  
                     }; 
        var chartWidth = svgWidth - margin.left - margin.right,
        chartHeight = svgHeight - margin.top - margin.bottom;
        
        options.svg.attr('width', svgWidth).attr("height", svgHeight)
          // .style('background', "#cecece")
        ;
        
        //append a group.
        var chartgroup = options.svg.append("g").attr("class", "chartgroup").attr("transform", "translate("+margin.left+", "+margin.top+")");  
        
        /* ~~~~~~~~~ Draw the chart ~~~~~~~~~ */
        
        var x_scale = d3.scaleLinear().domain([options.chartMin, options.chartMax]).range([0, chartWidth]); 
              
        var y_scale = d3.scaleBand().domain([""]).rangeRound([0, chartHeight]); 
        
        
        var xAxis = chartgroup.append("g").attr("class", "x-axis");
        xAxis
           .attr("transform", "translate(0," + chartHeight + ")")
           .call(
             d3
               .axisBottom(x_scale)
               .tickSizeInner(-chartHeight)
               .tickSizeOuter(0)
               .tickPadding(5)
               .tickValues(options.tickValues)
           )
           .call(g => g.select(".domain").remove());              // remove the horizontal line of the x axis. The horizontal line through the chart is a y axis tick. 
        
        
        var yAxis = chartgroup.append("g").attr("class", "y-axis");    // the y axis will have one tick, which forms the horizontal line through the center of the chart. 
        yAxis
           .call(
             d3
               .axisLeft(y_scale)
               .tickSizeInner(-chartWidth)
               .tickSizeOuter(0)
               .tickPadding(0)
           )
           .call(g => g.select(".domain").remove())           // no vertical line for the y axis (all vertical lines are x axis ticks)
           .call(g => g.selectAll("text").remove());          // no labels on y axis

       
       /* ~~~~~~~~~ circles ~~~~~~~~~ */ 
        
       var circles = chartgroup.append("g").attr("class", "circles");
        
       var jitterWidth = chartHeight; 
        
       circles.selectAll("circle")
           .data(options.allData)
           .enter()
           .append("circle")
           .attr("cx", function(d){return x_scale(d[options.attributeKey])})     // x position
           // Math.random() returns values from 0 to less than 1, in approximately uniform distribution. 
           .attr("cy", function(d){return chartHeight/2 - jitterWidth/2 + Math.random()*jitterWidth})     // y position
           .attr('r', 3)                                      // radius 
           .attr("fill", "#406058")                           // fill color
           .attr("opacity", "0.7");                           // opacity
        
        
        var annotation = chartgroup.append("g").attr("class", "annotation"); 
        var annotationRadius = 5;
        var annotationLineLength = 20; 
        var annotationLabelPadding = 5;
         
        
        var annotationData = [{rrr: options.siteInfo[options.attributeKey]}];
        
        annotation.selectAll("circle")
           .data(annotationData)
           .enter()
           .append("circle")
           .attr("cx", function(d){                       
                          return x_scale(d.rrr)})              // x position
           .attr("cy", function(d){return chartHeight/2})     // y position
           .attr('r', annotationRadius)                        // radius 
           .attr("fill", "#406058")                           // fill color
           .attr("stroke", "#000")
           .attr("stroke-width", 2)
           .attr("opacity", "0.85");                           // opacity
        
        annotation.selectAll("polyline")
           .data(annotationData)
           .enter()
           .append("polyline")
           .attr('stroke', "#333333")      //set appearance
           .attr("stroke-width", 2)        //set appearance
           .style('fill', 'none')          //set appearance
           .attr('points', function(d){
                 
                  // two points on each line: 
                  // A: centroid of the circle
                  // B: 10 px above the circle
                  // each point is defined by an [x, y] 
                 var startpoint = [0,0];
                     startpoint[0] = x_scale(d.rrr);
                     startpoint[1] = (chartHeight/2)-annotationRadius; 
           
                 var endpoint = [0,0];
                     endpoint[0] = x_scale(d.rrr);
                     endpoint[1] = (chartHeight/2)-annotationRadius-annotationLineLength; 
           
                 //  console.log("start, end", startpoint, endpoint)
                  return [startpoint, endpoint]        // return A, B
           });
           
        annotation.selectAll("text")
           .data(annotationData)
           .enter()
           .append("text")
           .attr("font-weight", "bold")
           .html(function(d){ return options.label+": "+d.rrr})
           .attr("transform", function(d){
              var textpoint = [0, 0];
                  textpoint[0] = x_scale(d.rrr);
                  textpoint[1] = (chartHeight/2)-annotationRadius-annotationLineLength-annotationLabelPadding; 
           return 'translate('+textpoint+')'

           })
           .style('text-anchor', "middle");
       
        
        
        
     };
     
     // return an object with all methods of dotPlot named
     return {
        
        draw: draw
     }
     
  })();

  exports.AppCollapsible = AppCollapsible;
  exports.AppSidebar = AppSidebar;
  exports.AppSpinner = AppSpinner;
  exports.DownloadSection = DownloadSection;
  exports.InRadio = InRadio;
  exports.ModalDialog = ModalDialog;
  exports.PDFViewButton = PDFViewButton;
  exports.PDFViewPanel = PDFViewPanel;
  exports.SiteBedMaterials = SiteBedMaterials;
  exports.SiteWaterQuality = SiteWaterQuality;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
