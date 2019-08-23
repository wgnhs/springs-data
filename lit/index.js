(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lit-element'), require('wgnhs-common')) :
  typeof define === 'function' && define.amd ? define(['exports', 'lit-element', 'wgnhs-common'], factory) :
  (global = global || self, factory(global.lit = {}, global.common, global.common));
}(this, function (exports, litElement, wgnhsCommon) { 'use strict';

  const reset = litElement.css`
/* http://meyerweb.com/eric/tools/css/reset/
   v2.0-modified | 20110126
   License: none (public domain)
*/
/* https://gist.github.com/DavidWells/18e73022e723037a50d6
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}

/* make sure to set some focus styles for accessibility */
:focus {
    outline: 0;
}

/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
	display: block;
}

body {
	line-height: 1;
}

ol, ul {
	list-style: none;
}

blockquote, q {
	quotes: none;
}

blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}

table {
	border-collapse: collapse;
	border-spacing: 0;
}

input[type=search]::-webkit-search-cancel-button,
input[type=search]::-webkit-search-decoration,
input[type=search]::-webkit-search-results-button,
input[type=search]::-webkit-search-results-decoration {
    -webkit-appearance: none;
    -moz-appearance: none;
}

input[type=search] {
    -webkit-appearance: none;
    -moz-appearance: none;
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
}

textarea {
    overflow: auto;
    vertical-align: top;
    resize: vertical;
}

/**
 * Correct 'inline-block' display not defined in IE 6/7/8/9 and Firefox 3.
 */

audio,
canvas,
video {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    max-width: 100%;
}

/**
 * Prevent modern browsers from displaying 'audio' without controls.
 * Remove excess height in iOS 5 devices.
 */

audio:not([controls]) {
    display: none;
    height: 0;
}

/**
 * Address styling not present in IE 7/8/9, Firefox 3, and Safari 4.
 * Known issue: no IE 6 support.
 */

[hidden] {
    display: none;
}

/**
 * 1. Correct text resizing oddly in IE 6/7 when body 'font-size' is set using
 *    'em' units.
 * 2. Prevent iOS text size adjust after orientation change, without disabling
 *    user zoom.
 */

html {
    font-size: 100%; /* 1 */
    -webkit-text-size-adjust: 100%; /* 2 */
    -ms-text-size-adjust: 100%; /* 2 */
}

/**
 * Address 'outline' inconsistency between Chrome and other browsers.
 */

a:focus {
    outline: thin dotted;
}

/**
 * Improve readability when focused and also mouse hovered in all browsers.
 */

a:active,
a:hover {
    outline: 0;
}

/**
 * 1. Remove border when inside 'a' element in IE 6/7/8/9 and Firefox 3.
 * 2. Improve image quality when scaled in IE 7.
 */

img {
    border: 0; /* 1 */
    -ms-interpolation-mode: bicubic; /* 2 */
}

/**
 * Address margin not present in IE 6/7/8/9, Safari 5, and Opera 11.
 */

figure {
    margin: 0;
}

/**
 * Correct margin displayed oddly in IE 6/7.
 */

form {
    margin: 0;
}

/**
 * Define consistent border, margin, and padding.
 */

fieldset {
    border: 1px solid #c0c0c0;
    margin: 0 2px;
    padding: 0.35em 0.625em 0.75em;
}

/**
 * 1. Correct color not being inherited in IE 6/7/8/9.
 * 2. Correct text not wrapping in Firefox 3.
 * 3. Correct alignment displayed oddly in IE 6/7.
 */

legend {
    border: 0; /* 1 */
    padding: 0;
    white-space: normal; /* 2 */
    *margin-left: -7px; /* 3 */
}

/**
 * 1. Correct font size not being inherited in all browsers.
 * 2. Address margins set differently in IE 6/7, Firefox 3+, Safari 5,
 *    and Chrome.
 * 3. Improve appearance and consistency in all browsers.
 */

button,
input,
select,
textarea {
    font-size: 100%; /* 1 */
    margin: 0; /* 2 */
    vertical-align: baseline; /* 3 */
    *vertical-align: middle; /* 3 */
}

/**
 * Address Firefox 3+ setting 'line-height' on 'input' using '!important' in
 * the UA stylesheet.
 */

button,
input {
    line-height: normal;
}

/**
 * Address inconsistent 'text-transform' inheritance for 'button' and 'select'.
 * All other form control elements do not inherit 'text-transform' values.
 * Correct 'button' style inheritance in Chrome, Safari 5+, and IE 6+.
 * Correct 'select' style inheritance in Firefox 4+ and Opera.
 */

button,
select {
    text-transform: none;
}

/**
 * 1. Avoid the WebKit bug in Android 4.0.* where (2) destroys native 'audio'
 *    and 'video' controls.
 * 2. Correct inability to style clickable 'input' types in iOS.
 * 3. Improve usability and consistency of cursor style between image-type
 *    'input' and others.
 * 4. Remove inner spacing in IE 7 without affecting normal text inputs.
 *    Known issue: inner spacing remains in IE 6.
 */

button,
html input[type="button"], /* 1 */
input[type="reset"],
input[type="submit"] {
    -webkit-appearance: button; /* 2 */
    cursor: pointer; /* 3 */
    *overflow: visible;  /* 4 */
}

/**
 * Re-set default cursor for disabled elements.
 */

button[disabled],
html input[disabled] {
    cursor: default;
}

/**
 * 1. Address box sizing set to content-box in IE 8/9.
 * 2. Remove excess padding in IE 8/9.
 * 3. Remove excess padding in IE 7.
 *    Known issue: excess padding remains in IE 6.
 */

input[type="checkbox"],
input[type="radio"] {
    box-sizing: border-box; /* 1 */
    padding: 0; /* 2 */
    *height: 13px; /* 3 */
    *width: 13px; /* 3 */
}

/**
 * 1. Address 'appearance' set to 'searchfield' in Safari 5 and Chrome.
 * 2. Address 'box-sizing' set to 'border-box' in Safari 5 and Chrome
 *    (include '-moz' to future-proof).
 */

input[type="search"] {
    -webkit-appearance: textfield; /* 1 */
    -moz-box-sizing: content-box;
    -webkit-box-sizing: content-box; /* 2 */
    box-sizing: content-box;
}

/**
 * Remove inner padding and search cancel button in Safari 5 and Chrome
 * on OS X.
 */

input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-decoration {
    -webkit-appearance: none;
}

/**
 * Remove inner padding and border in Firefox 3+.
 */

button::-moz-focus-inner,
input::-moz-focus-inner {
    border: 0;
    padding: 0;
}

/**
 * 1. Remove default vertical scrollbar in IE 6/7/8/9.
 * 2. Improve readability and alignment in all browsers.
 */

textarea {
    overflow: auto; /* 1 */
    vertical-align: top; /* 2 */
}

/**
 * Remove most spacing between table cells.
 */

table {
    border-collapse: collapse;
    border-spacing: 0;
}

html,
button,
input,
select,
textarea {
    color: #222;
}


::-moz-selection {
    background: #b3d4fc;
    text-shadow: none;
}

::selection {
    background: #b3d4fc;
    text-shadow: none;
}

img {
    vertical-align: middle;
}

fieldset {
    border: 0;
    margin: 0;
    padding: 0;
}

textarea {
    resize: vertical;
}

.chromeframe {
    margin: 0.2em 0;
    background: #ccc;
    color: #000;
    padding: 0.2em 0;
}
`;

  /**
   * @import url('https://fonts.googleapis.com/css?family=Open+Sans&display=swap');
   */
  const opensans = litElement.css`
/* cyrillic-ext */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local('Open Sans Regular'), local('OpenSans-Regular'), url(https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFWJ0bbck.woff2) format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local('Open Sans Regular'), local('OpenSans-Regular'), url(https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFUZ0bbck.woff2) format('woff2');
  unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek-ext */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local('Open Sans Regular'), local('OpenSans-Regular'), url(https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFWZ0bbck.woff2) format('woff2');
  unicode-range: U+1F00-1FFF;
}
/* greek */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local('Open Sans Regular'), local('OpenSans-Regular'), url(https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVp0bbck.woff2) format('woff2');
  unicode-range: U+0370-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local('Open Sans Regular'), local('OpenSans-Regular'), url(https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFWp0bbck.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local('Open Sans Regular'), local('OpenSans-Regular'), url(https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFW50bbck.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local('Open Sans Regular'), local('OpenSans-Regular'), url(https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0b.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
`;

  /**
   * @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
   */
  const materialIcons = litElement.css`
 /* fallback */
@font-face {
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2) format('woff2');
}

.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}
`;

  const structure = litElement.css`
body {
    font-family: var(--font-family);
    font-size: var(--font-size);
    line-height: var(--line-height);
    background-color: var(--palette-white);
}

body,
p,
h1,
h2,
h3,
h4,
h5 {
    color: var(--palette-black);
    font-family: var(--font-family);
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

h1,
h2,
h3,
h4,
h5 {
    padding: var(--border-radius) 0 var(--font-size-small) 0;
    font-weight: var(--font-weight-bold);
}

h1 {
    font-size: var(--font-size-extra-large);
    color: var(--palette-accent);
}

h2 {
    font-size: var(--font-size-large);
}

p {
    line-height: var(--line-height);
    margin: 0 0 var(--font-size) 0;
}

a {
    color: var(--palette-900);
    cursor: pointer;
    text-decoration-line: underline;
    text-decoration-style: dashed;
    text-decoration-color: var(--palette-900);
}
`;

  const typography = [
      opensans,
      materialIcons,
      structure
  ];

  const styles = [
    reset,
    ...typography
  ];

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
      return [
        ...styles,
        litElement.css`
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
    `];
    }

    render() {
      return litElement.html`
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
      box-sizing: border-box;
      margin: var(--border-radius) 0;
      border: var(--el-border, none);
      border-radius: var(--border-radius);
    }

    input[type='checkbox'] {
      display: none;
    }

    .lbl-toggle {
      display: block;

      font-weight: var(--el-header-font-weight, var(--font-weight-bold));
      font-size: var(--el-header-font-size, var(--font-size-extra-large));
      text-align: center;

      padding: var(--border-radius);

      color: var(--el-header-color, var(--palette-accent));
      background: var(--el-header-background, var(--palette-light));

      cursor: pointer;

      border-radius: var(--border-radius);
      transition: border-radius var(--transition-duration, 0.3) cubic-bezier(0.755, 0.05, 0.855, 0.06);
    }

    .lbl-toggle:hover {
      color: var(--el-color-hover, var(--palette-900));
    }

    .lbl-toggle:focus {
      outline: thin dotted;
    }

    .collapsible-content {
      max-height: 0px;
      overflow: hidden;
      transition: max-height var(--transition-duration, 0.3) cubic-bezier(0.86, 0, 0.07, 1);
    }

    .wrap-collapsible:not([button]) .toggle:checked ~ .collapsible-content {
      max-height: var(--el-max-height, 3000px);
    }

    .wrap-collapsible:not([button]) .toggle:checked ~ .lbl-toggle {
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      transition: border 0s;
    }

    .collapsible-content .content-inner {
      background: var(--el-content-background, var(--palette-white));
      border-bottom: 1px solid var(--el-header-background, var(--palette-light));
      border-right: 1px solid var(--el-header-background, var(--palette-light));
      border-left: 1px solid var(--el-header-background, var(--palette-light));
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
      <input id="${this.genId}" class="toggle" type="checkbox" .checked="${this.open}" @change=${this._handleChange}>
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
        },
        tabs: {
          type: Array
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
      ${(!this.title)?'':litElement.html`<h1 class="header">${this.title}</h1>`}
      <slot></slot>
      ${!(this.tabs)?'':this.tabs.map((el) => litElement.html`
      <slot name='${el}' hidden></slot>
      `)}
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
      return [
        ...styles,
        litElement.css`
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
    `];
    }

    render() {
      return litElement.html`
      <div class="modal b-close-modal" role="dialog" aria-hidden="true" ?data-closed="${!this.open}" @click="${this.handleClick}">
        <div class="modal-window">
            <button class="control modal-close b-close-modal"><i class="material-icons b-close-modal" title="Hide">close</i></button>
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
      return [
        ...styles,
        litElement.css`
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
    `];
    }

    render() {
      return litElement.html`
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
      return [
        ...styles,
        litElement.css`
    .container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: var(--border-radius);
    }

    [data-closed] {
      display: none;
    }
    `];
    }

    render() {
      return litElement.html`
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

  const formatDate = function formatDate(item) {
    return (!item) ?
      null :
      new Date(item).toISOString().substring(0,10);
  };

  const roundToTwoDecimals = function roundToTwoDecimals(item) {
    return (!item) ?
      null :
      item.toFixed(2);
  };
  const keyLookup = {
    'pH': { 'title': 'pH', 'desc': 'Measured as close to spring source as possible.' },
    'Conductivity_uS': { 'title': 'Conductivity (µS)', 'desc': 'Specific Conductance: Measured as close to spring source as possible (µmho/cm).' },
    'Water_Temp_C': { 'title': 'Temperature (°C)', 'desc': 'Measured as close to spring source as possible (°C).' },
    'SpringID': { 'title': 'Spring ID', 'desc': 'Unique identifier within county.' },
    'County': { 'title': 'County', 'desc': 'County where spring is located.' },
    'Surveyor': { 'title': 'Surveyor(s)', 'desc': 'Who conducted the survey (initials).' },
    'Date': { 'title': 'Date', 'desc': 'Date of field survey.', 'transform': formatDate },
    'Time': { 'title': 'Time', 'desc': 'Start time.' },
    'Easting_WTM': { 'title': 'Easting (WTM)', 'desc': 'Easting (WTM). As close to the spring source as possible.', 'transform': roundToTwoDecimals },
    'Northing_WTM': { 'title': 'Northing (WTM)', 'desc': 'Northing (WTM). As close to the spring source as possible.', 'transform': roundToTwoDecimals },
    'Horz_Precision_m': { 'title': 'Horizontal Precision (meters)', 'desc': 'Horizontal accuracy of GPS position (meters).' },
    'Max_PDOP': { 'title': 'Maximum PDOP', 'desc': 'Maximum positional dilution of precision (PDOP) during measurement.' },
    'Elevation_m': { 'title': 'Elevation (meters)', 'desc': 'From digital elevation model (DEM) (meters).', 'transform': roundToTwoDecimals },
    'elevation_source': { 'title': 'Elevation Source', 'desc': 'DEM source and horizontal resolution of DEM used to extract elevation.' },
    'Land_Owner': { 'title': 'Land Ownership', 'desc': 'List: state, county, city, NPS, USFS, tribal, military, private, other.' },
    'Access': { 'title': 'Access', 'desc': 'Directions to springs.' },
    'Ease_Access': { 'title': 'Ease of Access', 'desc': 'List: Easy access, Difficult access, Terrain prohibits access to other potential spring areas.' },
    'Land_Cover': { 'title': 'Land Cover', 'desc': 'List: urban, residential, agriculture, grassland, forest, open water, wetland, barren, shrubland, other.' },
    'Air_Temp_F': { 'title': 'Air Temperature (°F)', 'desc': 'Air temperature on date surveyed (°F).' },
    'Cloud_Cover_percent': { 'title': 'Cloud Cover (%)', 'desc': 'Cloud cover at time of survey (%).' },
    'Wind_Speed_mph': { 'title': 'Wind Speed (mph)', 'desc': 'Velocity measurement on date surveyed (mph).' },
    'Aspect_degrees': { 'title': 'Aspect', 'desc': 'Direction that the spring orifice faces.' },
    'Slope_degrees': { 'title': 'Slope (°)', 'desc': 'Channel slope (°).' },
    'Slope_Variability': { 'title': 'Slope Variability', 'desc': 'List: high, medium, low, none.' },
    'Condition': { 'title': 'Condition', 'desc': 'List: undisturbed, light, moderate, high.' },
    'Type_of_Disturbance': { 'title': 'Type of Disturbance', 'desc': 'List: wildlife, livestock, recreation, diversion, residence, impounded, dredging, flooding, trails, roadway, invasives, spring house, encased, raceways, human-made structure, trash, storm-water, drain tile, agriculture, other.' },
    'Spring_Area_sqm': { 'title': 'Spring Area (m²)', 'desc': 'List: <2 m², 2-10 m², 10-100 m², 100-1000 m², 1000-10,000 m², 10,000-100,000 m²' },
    'Surface_Types': { 'title': 'Surface Type(s)', 'desc': 'List: backwall, colluvial slope, sloping bedrock, pool, channel, spring mound, cave, other.' },
    'Width_ft': { 'title': 'Channel or Pool Width (feet)', 'desc': 'If a channel or pool exists, the mean width (feet).' },
    'Width_Location': { 'title': 'Width Location', 'desc': 'List: pool, channel, pond, spring house, other.' },
    'Depth_cm': { 'title': 'Channel or Pool Depth (cm)', 'desc': 'If a channel or pool exists, the mean depth (cm).' },
    'Depth_Location': { 'title': 'Depth Location', 'desc': 'List: pool, channel, pond, spring house, other.' },
    'Percent_organic': { 'title': 'Percent Organic', 'desc': 'Qualitative estimate of the % organics. Described as close to spring source as possible.' },
    'Percent_fines': { 'title': 'Percent Fines', 'desc': 'Qualitative estimate of the % fines. Described as close to spring source as possible.' },
    'Percent_sand': { 'title': 'Percent Sand', 'desc': 'Qualitative estimate of the % sand. Described as close to spring source as possible.' },
    'Percent_gravel': { 'title': 'Percent Gravel', 'desc': 'Qualitative estimate of the % gravel. Described as close to spring source as possible.' },
    'Percent_cobble': { 'title': 'Percent Cobble', 'desc': 'Qualitative estimate of the % cobble. Described as close to spring source as possible.' },
    'Percent_boulder': { 'title': 'Percent Boulder', 'desc': 'Qualitative estimate of the % boulder. Described as close to spring source as possible.' },
    'Percent_bedrock': { 'title': 'Percent Bedrock', 'desc': 'Qualitative estimate of the % bedrock. Described as close to spring source as possible.' },
    'Bedrock_Comp': { 'title': 'Bedrock Composition', 'desc': 'List: shale, siltstone, sandstone, conglomerate, limestone, dolomite, igneous or metamorphic, NA, other.' },
    'Spring_Type': { 'title': 'Spring Type', 'desc': 'List: helocrene, rheocrene, limnocrene, hillslope spring, cased, flowing well, other.' },
    'Spring_Source': { 'title': 'Spring Source', 'desc': 'List: single orifice, multiple orifices, diffuse flow, other.' },
    'Orifice_Geom': { 'title': 'Orifice Geomorphic Type', 'desc': 'List: seepage/filtration, fracture, tubular, contact.' },
    'Discharge_cfs': { 'title': 'Discharge (cfs)', 'desc': 'Spring flow (cfs).' },
    'Flow_Accuracy': { 'title': 'Flow Accuracy', 'desc': 'Level of accuracy of flow measurement, List: low, high' },
    'Discharge_Meas': { 'title': 'How Measured', 'desc': 'List: timed volume, float velocity method, flume, AA meter, AD meter (acoustic Doppler meter), EM meter (electromagnetic meter).' },
    'Flow_Location': { 'title': 'Flow Location', 'desc': 'Where flow was measured.' },
    'Flow_percent': { 'title': 'Flow %', 'desc': 'Percent of flow captured (%).' },
    'Veg_Bed_Cover_percent': { 'title': 'Vegetative Bed Cover (%)', 'desc': 'The proportion of the spring pool bed or channel bed that is covered by live vegetation (%).' },
    'Veg_Bank_Cover_percent': { 'title': 'Vegetative Bank Cover (%)', 'desc': 'The proportion of the spring pool banks or channel banks that is covered by live vegetation (%).' },
    'Notes': { 'title': 'Notes', 'desc': 'Other notes as necessary.' },
    'GlobalID': { 'title': 'Global ID', 'desc': 'Automatically generated unique and global ID' },
    'gps_time_date': { 'title': 'GPS time and date', 'desc': 'Automatically generated GPS time and date stamp' },
    'sat_signals': { 'title': 'Number of satellites', 'desc': 'Automatically generated number of satellites visible' }
  };

  const colorRange = [
    'var(--map-bin-0)',
    'var(--map-bin-1)',
    'var(--map-bin-2)',
    'var(--map-bin-3)',
    'var(--map-bin-4)',
    'var(--map-bin-5)',
    'var(--map-bin-6)'
  ];

  const binRanges = {
    'Conductivity_uS': [
      [],
      [],
      [0, 300],
      [300, 502],
      [502, 676],
      [676, 926],
      [926, 2000]
    ],
    'Discharge_cfs': [
      [0.1, 0.2],
      [0.2, 0.5],
      [0.5, 1.0],
      [1, 2],
      [2, 5],
      [5, 10],
      [10, 20]
    ]
  };
  const RestylingCircleMarker = L.CircleMarker.extend({
    getEvents: function() {
      return {
        zoomend: this._restyle,
        normalpoints: this._normal,
        typepoints: this._orifice,
        condpoints: this._conductivity,
        qpoints: this._discharge
      }
    },
    _restyle: function(e) {
      this.setRadius(RestylingCircleMarker.calcRadius(e.target.getZoom()));
    },
    _normal: function() {
      let color = 'var(--map-symbol)';
      if (!this._activeBackup) {
        this.setStyle({'color': color});
      } else {
        this._activeBackup = color;
      }
    },
    _orifice: function() {
      var color = 'var(--map-symbol)';
      var prop = 'Orifice_Geom';
      if (this.feature.properties[prop] === 'seepage/filtration') {
        color = 'var(--map-symbol-alt)';
      }
      if (!this._activeBackup) {
        this.setStyle({'color': color});
      } else {
        this._activeBackup = color;
      }
    },
    _conductivity: function() {
      var prop = 'Conductivity_uS';
      this._binPoint(prop);
    },
    _discharge: function() {
      var prop = 'Discharge_cfs';
      this._binPoint(prop);
    },
    _binPoint: function(prop) {
      let result = RestylingCircleMarker.binPoint(prop, this.feature.properties);
      if (!this._activeBackup) {
        this.setStyle({'color': result});
      } else {
        this._activeBackup = result;
      }
    },
    highlight: function() {
      this._activeBackup = this.options.color;
      this.setStyle({'color': 'var(--map-symbol-active'});
    },
    removeHighlight: function() {
      if (this._activeBackup) {
        this.setStyle({'color': this._activeBackup});
        this._activeBackup = null;
      }
    }
  });

  RestylingCircleMarker.calcRadius = (a) => Math.max(Math.floor(a/1.5),3);
  RestylingCircleMarker.binPoint = (prop, data) => {
    let result = "#406058";
    const ranges = binRanges[prop];
    if (ranges) {
      const val = data[prop];
      for (let i = 0; i < ranges.length; i++) {
        if (ranges[i] && val > ranges[i][0] && val <= ranges[i][1]) {
          result = colorRange[i];
        }
      }
    }
    return result;
  };

  // https://github.com/wbkd/d3-extended
      d3.selection.prototype.moveToFront = function() {  
        return this.each(function(){
          this.parentNode.appendChild(this);
        });
      };
      d3.selection.prototype.moveToBack = function() {  
          return this.each(function() { 
              var firstChild = this.parentNode.firstChild; 
              if (firstChild) { 
                  this.parentNode.insertBefore(this, firstChild); 
              } 
          });
      };

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

            .annotated{
               stroke-width: 2; 
               stroke: #333; 
               opacity: 1; 
               fill: #000;
               r:5;
               
            }
            .highlighted{
               stroke-width: 2;
               stroke: #000;
               opacity: 1; 
               r:5;

            }
        `;
      }

    render() {
      return litElement.html`
        <div class="container">
        <!-- <h2>Water quality</h2> -->
       <!-- <span class="label">Discharge: </span><span>${this.siteinfo.Discharge_cfs}</span><br> -->
         <svg id="discharge-chart"></svg><br>

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
        this.dischargechart = d3.select(this.renderRoot.querySelector('#discharge-chart'));
        this.phchart = d3.select(this.renderRoot.querySelector('#ph-chart'));
        this.temperaturechart = d3.select(this.renderRoot.querySelector('#temperature-chart'));
        this.conductivitychart = d3.select(this.renderRoot.querySelector('#conductivity-chart'));

        var siteDischarge = [{Discharge:this.siteinfo.Discharge_cfs}];
        var siteph = [{pH:this.siteinfo.pH}];
        var siteWaterTemp = [{Water_Temp_C: this.siteinfo.Water_Temp_C}];
        var siteConductivity = [{Conductivity_uS: this.siteinfo.Conductivity_uS}];



        /* ~~~~~~~~~ SVG SETUP ~~~~~~~~~ */
        
        var dischargeDotPlotOptions = {
           svg: this.dischargechart,
           attributeKey: "Discharge_cfs",

           tickValues:[0, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20],
           chartMin: 0,
           chartMax: 20,
           
           domain: [0, 0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 10.0, 20.0],
           labelFormat: ".1f", //show one number past the decimal point. 

           siteInfo: this.siteinfo,
           allData:  aggrData.data

        };


        var phDotPlotOptions = {
           svg: this.phchart,
           attributeKey: "pH",

           tickValues:[5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0],
           chartMin: 5.5,
           chartMax: 10,
           
           domain: [5.5, 10],
           labelFormat: ".1f", //show one number past the decimal point.

           siteInfo: this.siteinfo,
           allData:  aggrData.data

        };

        var tempDotPlotOptions = {
           svg: this.temperaturechart,
           attributeKey: "Water_Temp_C",

           tickValues:[5,7,9,11,13,15,17],
           chartMin: 5,
           chartMax: 17,
           
           domain: [5, 17],
           labelFormat: "d", //show as integer (decimal notation)

           siteInfo: this.siteinfo,
           allData:  aggrData.data

        };

        var conductivityDotPlotOptions = {
           svg: this.conductivitychart,
           attributeKey: "Conductivity_uS",

           tickValues:[0, 250, 500, 750, 1000, 1250, 1500, 1750],
           chartMin: 0,
           chartMax: 1750,
           
           domain: [0, 1750],
           labelFormat: "d", //show as integer (decimal notation)

           siteInfo: this.siteinfo,
           allData:  aggrData.data

        };



        /* -- draw the dot plots --*/

        this.tempPlot = new DotPlot(tempDotPlotOptions);
        this.phPlot = new DotPlot(phDotPlotOptions);
        this.condPlot = new DotPlot(conductivityDotPlotOptions);
        this.dischargePlot = new DotPlot(dischargeDotPlotOptions);

        this.tempPlot.draw();
        this.phPlot.draw();
        this.condPlot.draw();
        this.dischargePlot.draw();

     }

     updated() {
        this.dischargePlot.annotate(this.siteinfo['Site_Code']);
        this.tempPlot.annotate(this.siteinfo['Site_Code']);
        this.phPlot.annotate(this.siteinfo['Site_Code']);
        this.condPlot.annotate(this.siteinfo['Site_Code']);
     }

  }   //end export class

  customElements.define('site-water-quality', SiteWaterQuality);



  class DotPlot {
     constructor(dotPlotOptions) {
     this.options = dotPlotOptions;

     this.svgWidth = 400;
     this.svgHeight = 140;

     this.margin = {
                    top: 50,
                    right: 20,
                    bottom: 50,
                    left: 20
                  };
     
     this.chartWidth = this.svgWidth - this.margin.left - this.margin.right,
     this.chartHeight = this.svgHeight - this.margin.top - this.margin.bottom;
     this.tickPadding = 10; // spacing needed to see the ticks extend past the dots. 
     
     }

     get x_scale() {
        
        //calculate the range values based on the domain values. If the domain has only two values, the range will be 0 and chartWidth. If there are more than two domain values, the chartWidth is evenly divided among them, creating a "polylinear" scale.  
        var setRange = []; 
        this.options.domain.forEach((e, i) => {
           setRange.push(this.chartWidth*i/(this.options.domain.length-1)); 
        });
        
        return d3.scaleLinear().domain(this.options.domain).range(setRange);
     }

     get y_scale() {
        return d3.scaleBand().domain([""]).rangeRound([0, this.chartHeight]);
     }

     draw(){
        var options = this.options;

        // console.log("draw dot plot ranging from "+options.chartMin+" to "+options.chartMax+" with the value "+options.siteInfo[options.attributeKey]+" annotated. ");


        options.svg.attr('width', this.svgWidth).attr("height", this.svgHeight);


        //append a group.
        var chartgroup = options.svg.append("g").attr("class", "chartgroup").attr("transform", "translate("+this.margin.left+", "+this.margin.top+")");

        /* ~~~~~~~~~ Draw the chart ~~~~~~~~~ */


        var xAxis = chartgroup.append("g").attr("class", "x-axis");
        xAxis
           .attr("transform", "translate(0," + this.chartHeight + ")")
           .call(
             d3
               .axisBottom(this.x_scale)
               .tickSizeInner(-this.chartHeight)
               .tickSizeOuter(0)
               .tickPadding(5)
               .tickValues(options.tickValues)
               .tickFormat(d3.format(this.options.labelFormat))
           )
           .call(g => g.select(".domain").remove());              // remove the horizontal line of the x axis. The horizontal line through the chart is a y axis tick.


        var yAxis = chartgroup.append("g").attr("class", "y-axis");    // the y axis will have one tick, which forms the horizontal line through the center of the chart.
        yAxis
           .call(
             d3
               .axisLeft(this.y_scale)
               .tickSizeInner(-this.chartWidth)
               .tickSizeOuter(0)
               .tickPadding(0)
           )
           .call(g => g.select(".domain").remove())           // no vertical line for the y axis (all vertical lines are x axis ticks)
           .call(g => g.selectAll("text").remove());          // no labels on y axis


       /* ~~~~~~~~~ create circles ~~~~~~~~~ */

       this.circles = chartgroup.append("g").attr("class", "circles");

       var jitterWidth = this.chartHeight-this.tickPadding;
       
        
        // within the circles group, append a (sub)group for each data point, and append to that (sub)group a circle. 
       var datapoint = this.circles.selectAll("g")
           .data(options.allData, (d) => { return d.Site_Code; })
           .enter()
           .append("g")
           .attr("class", "datapoint");
        
        
        var dot = datapoint.append("circle")
           .attr("cx", (d) => {return this.x_scale(d[options.attributeKey])})     // x position
           // Math.random() returns values from 0 to less than 1, in approximately uniform distribution.
           .attr("cy", (d) => {return this.chartHeight/2 - jitterWidth/2 + Math.random()*jitterWidth})     // y position
           .attr('r', 3)                                      // radius
           .attr("fill", (d) => { return RestylingCircleMarker.binPoint(options.attributeKey, d) })                           // fill color
           .attr("stroke", "#000")
           .attr("stroke-width", 0)
           .attr("opacity", "0.7")                           // opacity
           .attr("class", (d) => {
                    return d.Site_Code
                 })
           .on('click', (d) => {
                 console.log("switch to "+d['Site_Code']);
                 wgnhsCommon.dispatch(document, 'interaction', {params: d});
  //            this.annotate(d['Site_Code'])
           })
           .on('mouseenter', (d) => {this.highlight(d['Site_Code']);})
           .on('mouseleave', (d) => {this.unhighlight(d['Site_Code']);})
        
           .append("svg:title")
           .text((d) => d['Site_Code'])
           ;

     } // END DRAW. draw is called once when on firstUpdated. 
     
     //annotate is called on update only. 
     annotate(siteCode) {
       
        var options = this.options;

        //select all groups within the circles group, then filter down to the one that matches the site code. 
        var g = this.circles.selectAll("g")
           .filter((d) => d['Site_Code'] === siteCode)
           .moveToFront();
        
        var circle = g.select('circle')         
           .classed('annotated', true);          // add the annotation styling class to the circle. 


        var label = g.append("text")
           .attr('dy', '-0.75em') //vertical displacement 
           .html((d) => { 

              return keyLookup[options.attributeKey]['title'] + ": "+d[options.attributeKey]
           });
        
        g.append("polyline")
           .attr('stroke', "#333333")      //set appearance
           .attr("stroke-width", 3)        //set appearance
           .style('fill', 'none')          //set appearance
           .attr('points', (d) => {
           
              // two points on each line:
               // A: top of the plot, vertically aligned with the dot
               // B: bottom of the plot, vertically aligned with the dot
               // each point is defined by an [x, y]
              var startpoint = [0,0];
                  startpoint[0] = circle.attr('cx');
                  startpoint[1] = 0;

              var endpoint = [0,0];
                  endpoint[0] = circle.attr('cx');
                  endpoint[1] = this.chartHeight;

               // console.log("start, end", startpoint, endpoint)
               return [startpoint, endpoint]        // return A, B
           
           })
           .moveToBack()  // move behind the dot (moves to the back of the group)
           ; // end append polyline

       
     } //end annotate 
     
     highlight(siteCode){
        
        var g = this.circles.selectAll("g")
           .filter((d) => d['Site_Code'] === siteCode)
           .moveToFront();

           g.select('circle').classed('highlighted', true); 
        
     } // end highlight
     
     unhighlight(siteCode){
        var g = this.circles.selectAll("g")
           .filter((d) => d['Site_Code'] === siteCode);

           g.select('circle').classed('highlighted', false); 
        
     }  // end unhighlight 
     
  }

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
  exports.styles = styles;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
