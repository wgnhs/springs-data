(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lit-element')) :
  typeof define === 'function' && define.amd ? define(['exports', 'lit-element'], factory) :
  (global = global || self, factory(global.index = {}, global.common));
}(this, function (exports, litElement) { 'use strict';

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

  // https://gist.github.com/gordonbrander/2230317
  const genId = function() {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

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
          type: Boolean
        }
      };
    }

    constructor() {
      super();
      this.genId = genId();
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

    .toggle:checked + .lbl-toggle + .collapsible-content {
      max-height: var(--collapsible-max-height, 3000px);
    }

    .toggle:checked + .lbl-toggle {
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
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
    <div class="wrap-collapsible">
      <input id="${this.genId}" class="toggle" type="checkbox" ?checked="${this.open}">
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
  }
  customElements.define('app-collapsible', AppCollapsible);

  /*!
    @license https://github.com/ciampo/macro-carousel/blob/master/LICENSE
    macro-carousel 1.0.0
  */
  !function(){let t;function getEvtListenerOptions(i){return !!function(){if(void 0===t){t=!1;try{const i=Object.defineProperty({},"passive",{get:()=>{t=!0;}});window.addEventListener("test",null,i);}catch(t){}}return t}()&&{passive:i}}function clamp(t,i=t,s=t){let e=t;if(i>s)throw new RangeError(`'min' ${i} should be lower than 'max' ${s}`);return t<i&&(e=i),t>s&&(e=s),e}function booleanSetter(t,i,s){s?t.setAttribute(i,""):t.removeAttribute(i);}function booleanGetter(t,i){return t.hasAttribute(i)}function intSetter(t,i,s){t.setAttribute(i,s);}function intGetter(t,i,s=0){const e=t.getAttribute(i);return null===e?s:parseInt(e,10)}function normalizeEvent(t){if("touchstart"===t.type||"touchmove"===t.type||"touchend"===t.type){const i=t.targetTouches[0]||t.changedTouches[0];return {x:i.clientX,y:i.clientY,id:i.identifier,event:t}}return {x:t.clientX,y:t.clientY,id:null,event:t}}const i=document.createElement("template");i.innerHTML='<style>:host{position:relative;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch;contain:content;-webkit-tap-highlight-color:rgba(0,0,0,0);--macro-carousel-gap:16px;--macro-carousel-background-color:transparent;--macro-carousel-slide-min-height:0px;--macro-carousel-slide-max-height:none;--macro-carousel-transition-duration:0.6s;--macro-carousel-transition-timing-function:cubic-bezier(0.25,0.46,0.45,0.94);--macro-carousel-pagination-gap:2px;--macro-carousel-pagination-height:44px;--macro-carousel-fallback-message-color-background:#fff;--macro-carousel__internal__slides-per-view:1}:host([hidden]){display:none}:host-context(.js-focus-visible) ::slotted(:focus:not(.focus-visible)),:host-context(.js-focus-visible) :focus:not(.focus-visible){outline:0}#externalWrapper{height:100%;overflow:hidden;contain:paint;background-color:var(--macro-carousel-background-color);-ms-touch-action:pan-y pinch-zoom;touch-action:pan-y pinch-zoom;cursor:-webkit-grab;cursor:grab}#externalWrapper:active{cursor:-webkit-grabbing;cursor:grabbing}:host([disable-drag]) #externalWrapper{cursor:default}#slidesWrapper{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch;height:100%;min-height:var(--macro-carousel-slide-min-height);max-height:var(--macro-carousel-slide-max-height);will-change:transform}:host([transitioning]) #slidesWrapper{-webkit-transition-property:-webkit-transform;transition-property:-webkit-transform;transition-property:transform;transition-property:transform,-webkit-transform;-webkit-transition-duration:var(--macro-carousel-transition-duration);transition-duration:var(--macro-carousel-transition-duration);-webkit-transition-timing-function:var(--macro-carousel-transition-timing-function);transition-timing-function:var(--macro-carousel-transition-timing-function)}#slidesWrapper ::slotted(*){-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;-ms-flex-negative:0;flex-shrink:0;-ms-flex-preferred-size:calc((100% - (var(--macro-carousel__internal__slides-per-view) - 1) * var(--macro-carousel-gap)) / var(--macro-carousel__internal__slides-per-view));flex-basis:calc((100% - (var(--macro-carousel__internal__slides-per-view) - 1) * var(--macro-carousel-gap)) / var(--macro-carousel__internal__slides-per-view));min-height:var(--macro-carousel-slide-min-height);max-height:var(--macro-carousel-slide-max-height);margin-right:var(--macro-carousel-gap);overflow:hidden;outline:0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.slidesFallback{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;margin:0;padding:.5em 1em;width:100%;background-color:var(--macro-carousel-fallback-message-color-background)}:host([disable-drag]) #slidesWrapper ::slotted(*){-webkit-user-select:auto;-moz-user-select:auto;-ms-user-select:auto;user-select:auto}#pagination{display:none}:host([pagination]) #pagination{-ms-flex-item-align:center;align-self:center;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;width:100%;height:var(--macro-carousel-pagination-height);contain:strict;font-size:0}div ::slotted(macro-carousel-pagination-indicator){margin:0 calc(var(--macro-carousel-pagination-gap) / 2);padding:0;font-size:inherit;opacity:.8}div ::slotted(macro-carousel-pagination-indicator.selected),div ::slotted(macro-carousel-pagination-indicator:hover){opacity:1}#navigation{display:none}:host([navigation]) #navigation{display:block}div ::slotted(macro-carousel-nav-button){position:absolute;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}:host([pagination]) div ::slotted(macro-carousel-nav-button){top:calc(50% - var(--macro-carousel-pagination-height) / 2)}div ::slotted(.macro-carousel-previous){left:0}div ::slotted(.macro-carousel-next){right:0}#aria-live ::slotted(*){position:absolute;height:1px;width:1px;margin:-1px;padding:0;clip:rect(0 0 0 0);overflow:hidden;border:0}@media print{#slidesWrapper ::slotted(*){margin-right:0;margin-bottom:.2em;outline:1px solid #000;color:#000;page-break-inside:avoid}:host([navigation]) #navigation,:host([pagination]) #pagination{display:none}#slidesWrapper{display:block;-webkit-transform:none!important;transform:none!important;-webkit-transition:0s;transition:0s}}</style> <div id="externalWrapper"> <div id="slidesWrapper"> <slot id="slidesSlot"> <p class="slidesFallback">No content available</p> </slot> </div> </div> <div id="navigation"> <slot id="navigationSlot" name="navigationSlot"></slot> </div> <div id="pagination"> <slot id="paginationSlot" name="paginationSlot"></slot> </div> <div id="aria-live"> <slot id="ariaSlot" name="ariaSlot"></slot> </div> ',window.ShadyCSS&&window.ShadyCSS.prepareTemplate(i,"macro-carousel");const s=.5,e=2,o=Math.abs((a=35,Math.round(100*Math.tan(a*Math.PI/180))/100));var a;const n=5;window.customElements.define("macro-carousel",class MacroCarousel extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(i.content.cloneNode(!0)),this.t=this.shadowRoot.querySelector("#externalWrapper"),this.i=this.shadowRoot.querySelector("#slidesWrapper"),this.s=this.shadowRoot.querySelector("#slidesSlot"),this.e=this.shadowRoot.querySelector("#ariaSlot"),this.o=this.shadowRoot.querySelector("#paginationSlot"),this.a=[],this.n=this.shadowRoot.querySelector("#navigationSlot"),this.r=void 0,this.h=void 0,this.c=[],this.l=-1,this.d=!1,this.u=0,this.m=0,this.g=0,this.p=0,this.b=0,this.v=0,this.w=void 0,this.f=!1,this.k=!1,this._=void 0,this.S=void 0,this.z=void 0,this.M=void 0,this.C=void 0,this.W=void 0,this.P=void 0,this.L=void 0,this.G=[],this.F=!1,this.I=50,this.$=20,this.A=.7,this.D=.04,this.T=0,this.N=!1;}connectedCallback(){window.ShadyCSS&&window.ShadyCSS.styleElement(this),this.hasAttribute("role")||this.setAttribute("role","list"),this.j("selected"),this.j("loop"),this.j("navigation"),this.j("pagination"),this.j("disableDrag"),this.j("slidesPerView"),this.j("reducedMotion"),this.j("autoFocus"),this.m=this.selected,this.O(),this.s.addEventListener("slotchange",this),window.addEventListener("resize",this,getEvtListenerOptions(!0)),this.addEventListener("keydown",this),window.addEventListener("touchmove",function(){}),this.q();}disconnectedCallback(){this.s.removeEventListener("slotchange",this),window.removeEventListener("resize",this),this.disableDrag||(this.t.removeEventListener("touchstart",this),this.t.removeEventListener("mousedown",this)),this.navigation&&(this.r.removeEventListener("macro-carousel-nav-button-clicked",this),this.h.removeEventListener("macro-carousel-nav-button-clicked",this)),this.pagination&&this.a.forEach(t=>{t.removeEventListener("macro-carousel-pagination-indicator-clicked",this);});}handleEvent(t){"resize"===t.type&&t.target===window?(this.B(),this.update()):"slotchange"===t.type&&t.target===this.s?this.q():"macro-carousel-pagination-indicator-clicked"===t.type&&this.pagination?this.V(t):"macro-carousel-nav-button-clicked"===t.type&&this.navigation?t.target===this.r?this.previous():t.target===this.h&&this.next():"keydown"===t.type?37===t.keyCode||38===t.keyCode?this.previous():39!==t.keyCode&&40!==t.keyCode||this.next():"transitionend"===t.type&&t.target===this.i?(this.H(),this.R(),this.X()):"touchstart"===t.type||"mousedown"===t.type?this.Y(normalizeEvent(t)):"touchmove"===t.type||"mousemove"===t.type?this.U(normalizeEvent(t)):"touchend"===t.type||"mouseup"===t.type?this.J(normalizeEvent(t)):"touchcancel"===t.type&&this.K();}j(t){if(this.hasOwnProperty(t)){const i=this[t];delete this[t],this[t]=i;}}update(){clearTimeout(this.w),this.B(),this.w=setTimeout(()=>{this.Q();},50);}Q(){this.Z(),this.tt(),this.it(),this.st(this.c.map(t=>t.layoutIndex),!0),this.et(this.selected),this.ot(),this.at(),this.nt(),this.H(),this.X(),this.O();}previous(){this.selected=this.rt(this.selected);}rt(t){let i=t;return t>0?i=t-1:this.loop&&(this.d&&(this.u-=1),i=this.l),clamp(i,0,this.l)}next(){this.selected=this.ht(this.selected);}ht(t){let i=t;return t<this.l?i=t+1:this.loop&&(this.d&&(this.u+=1),i=0),clamp(i,0,this.l)}static get observedAttributes(){return ["selected","loop","navigation","pagination","disable-drag","slides-per-view","reduced-motion","auto-focus"]}attributeChangedCallback(t,i,s){switch(0===this.c.length&&this.q(),t){case"selected":const e=parseInt(s,10);if(!Number.isFinite(e)||e>this.l||e<0)return void(this.selected=i||0);if(this.d){const t=this.selected+this.u*(this.l+1),i=this.m-t,s=[],e=i<0?this.slidesPerView+i:0;for(let o=-1;o<Math.abs(i);o++)s.push(o+t+e);this.st(s),this.m=t;}this.et(this.selected),this.ot(),this.at(),this.dispatchEvent(new CustomEvent("macro-carousel-selected-changed",{detail:this.selected,bubbles:!0})),this.f||this.N||(this.H(),this.R(),this.X());break;case"loop":this.tt(),this.it(),this.st(this.c.map((t,i)=>i)),this.at(),this.ot(),this.H(),this.R(),this.X(),window.ShadyCSS&&window.ShadyCSS.styleSubtree(this);break;case"navigation":this.update(),window.ShadyCSS&&window.ShadyCSS.styleSubtree(this);break;case"pagination":this.ot(),window.ShadyCSS&&window.ShadyCSS.styleSubtree(this);break;case"disable-drag":this.nt();break;case"slides-per-view":const o=parseInt(s,10);if(!Number.isFinite(o)||o<1||o>this.c.length)return void(this.slidesPerView=i||1);this.update(),window.ShadyCSS&&window.ShadyCSS.styleSubtree(this);break;case"reduced-motion":null!==s?this.B():this.O();}}set selected(t){intSetter(this,"selected",t);}get selected(){return intGetter(this,"selected")}set loop(t){booleanSetter(this,"loop",t);}get loop(){return booleanGetter(this,"loop")}set navigation(t){booleanSetter(this,"navigation",t);}get navigation(){return booleanGetter(this,"navigation")}set pagination(t){booleanSetter(this,"pagination",t);}get pagination(){return booleanGetter(this,"pagination")}set disableDrag(t){booleanSetter(this,"disable-drag",t);}get disableDrag(){return booleanGetter(this,"disable-drag")}set slidesPerView(t){intSetter(this,"slides-per-view",t);}get slidesPerView(){return intGetter(this,"slides-per-view",1)}set reducedMotion(t){booleanSetter(this,"reduced-motion",t);}get reducedMotion(){return booleanGetter(this,"reduced-motion")}set autoFocus(t){booleanSetter(this,"auto-focus",t);}get autoFocus(){return booleanGetter(this,"auto-focus")}B(){this.f=!1,this.removeAttribute("transitioning"),this.i.removeEventListener("transitionend",this,!1);}O(){this.reducedMotion||requestAnimationFrame(()=>{requestAnimationFrame(()=>{this.f=!0,this.setAttribute("transitioning",""),this.i.addEventListener("transitionend",this,!1);});});}Z(){this.g=this.i.getBoundingClientRect().width,this.p=this.ct(),this.b=this.lt();}lt(){return (this.g-(this.slidesPerView-1)*this.p)/this.slidesPerView}ct(){/\d$/.test(function(t,i){const s=getComputedStyle(t);return String(s.getPropertyValue(i)).trim()}(this,"--macro-carousel-gap"))&&console.warn("Warning: it looks like --macro-carousel-gap has a unitless value.\nAdd CSS units to its value to avoid breaking the slides layout.");const t=parseInt(getComputedStyle(this.c[0].element)["margin-right"],10);return Number.isFinite(t)?t:0}it(){var t,i,s;t=this,i="--macro-carousel__internal__slides-per-view",s=`${this.slidesPerView}`,t.style.setProperty(i,s),window.ShadyCSS&&window.ShadyCSS.styleSubtree(t,{[i]:s}),this.l=this.d?this.c.length-1:this.dt(),!this.d&&this.selected>this.l&&(this.selected=this.l);}dt(){return Math.max(0,this.c.length-this.slidesPerView)}ut(t){let i=t;for(;i<0;)i+=this.c.length;return i%this.c.length}st(t,i=!1){let s;t.forEach(t=>{!i&&this.c.find(i=>i.layoutIndex===t)||(s=this.ut(t),this.c[s].layoutIndex=t,this.c[s].position=this.mt(t),this.c[s].element.style.transform=`translateX(${this.mt(s-t)}px)`);});}mt(t){return -t*(this.b+this.p)}gt(t){this.i.style.transform=`translate3d(${t}px, 0, 0)`,this.v=t;}et(t){this.i&&!this.N&&this.gt(this.c[t].position);}R(){this.autoFocus&&this.c[this.selected].element.focus();}H(){const t=[];for(let i=0;i<this.slidesPerView;i++)t.push((this.selected+i)%this.c.length);let i;this.c.map(t=>t.element).forEach((s,e)=>{i=void 0!==t.find(t=>t===e),s.setAttribute("aria-hidden",i?"false":"true"),i?(s.removeAttribute("inert"),s.setAttribute("tabindex",-1)):s.setAttribute("inert","");});}ot(){if((!this.pagination||this.pagination&&this.o.assignedNodes().length!==this.l+1)&&(this.a.forEach(t=>{t.removeEventListener("macro-carousel-pagination-indicator-clicked",this),this.removeChild(t);}),this.a.length=0),this.pagination){if(this.o.assignedNodes().length!==this.l+1){const t=document.createDocumentFragment();for(let i=0;i<=this.l;i++){const s=document.createElement("macro-carousel-pagination-indicator");s.textContent=i,s.setAttribute("slot","paginationSlot"),s.setAttribute("aria-label",`Go to item ${i+1}`),s.addEventListener("macro-carousel-pagination-indicator-clicked",this),t.appendChild(s),this.a.push(s);}this.appendChild(t);}this.a.forEach((t,i)=>{i===this.selected?t.classList.add("selected"):t.classList.remove("selected");});}}V(t){this.selected=parseInt(t.target.textContent,10);}pt(t){const i=document.createElement("macro-carousel-nav-button");return i.classList.add(t),i.setAttribute("slot","navigationSlot"),i.addEventListener("macro-carousel-nav-button-clicked",this),/next/.test(t)&&i.setAttribute("flipped",""),i}at(){(!this.navigation||this.navigation&&2!==this.n.assignedNodes().length)&&(this.n.assignedNodes().forEach(t=>{t.removeEventListener("macro-carousel-nav-button-clicked",this),this.removeChild(t);}),this.r=void 0,this.h=void 0),this.navigation&&(2!==this.n.assignedNodes().length&&(this.r=this.pt("macro-carousel-previous"),this.appendChild(this.r),this.h=this.pt("macro-carousel-next"),this.appendChild(this.h)),this.r.disabled=!this.loop&&0===this.selected,this.h.disabled=!this.loop&&this.selected===this.l,this.r.setAttribute("aria-label",`Go to ${this.loop&&0===this.selected?"last":"previous"} item`),this.h.setAttribute("aria-label",`Go to ${this.loop&&this.selected===this.l?"first":"next"} item`));}tt(){this.d=this.loop&&this.dt()>1;}bt(){return this.s.assignedNodes({flatten:!0}).forEach(t=>{t.nodeType===Node.TEXT_NODE&&t.parentNode&&t.parentNode.removeChild(t);}),this.s.assignedNodes({flatten:!0}).filter(t=>t.nodeType===Node.ELEMENT_NODE).map((t,i)=>({element:t,layoutIndex:i,position:this.mt(i)}))||[]}q(){this.c=this.bt(),this.c.forEach(t=>{t.element.hasAttribute("tabindex")||t.element.setAttribute("tabindex",-1),"list"===this.getAttribute("role")&&t.element.setAttribute("role","listitem");});const t=this.c.length>0&&-1===this.l;this.Q(),t&&(this.selected=this.selected);}X(){1!==this.e.assignedNodes().length&&(this.vt=document.createElement("div"),this.vt.setAttribute("slot","ariaSlot"),this.vt.setAttribute("aria-live","polite"),this.vt.setAttribute("aria-atomic","true"),this.appendChild(this.vt));const t=this.c[this.selected].layoutIndex;let i="";for(let s=0;s<this.slidesPerView;s++)i+=(t+s)%this.c.length+1,s<this.slidesPerView-2?i+=", ":s<this.slidesPerView-1&&(i+=" and ");this.vt.textContent=`Item${this.slidesPerView>1?"s":""} ${i} of ${this.c.length} visible`;}nt(){this.disableDrag?(this.t.removeEventListener("touchstart",this),this.t.removeEventListener("mousedown",this)):(this.t.addEventListener("touchstart",this,getEvtListenerOptions(!0)),this.t.addEventListener("mousedown",this,getEvtListenerOptions(!0)));}Y(t){this.k||(this.N=!1,this.k=!0,this._=t.id,this.S=this.M=this.W=t.x,this.z=this.C=this.P=t.y,this.L=this.c[this.selected].layoutIndex,this.G=[],this.wt(this.M),window.addEventListener("touchmove",this,getEvtListenerOptions(!1)),window.addEventListener("mousemove",this,getEvtListenerOptions(!1)),window.addEventListener("mouseup",this),window.addEventListener("touchend",this),window.addEventListener("touchcancel",this));}U(t){if(this.k&&t.id===this._){this.W=t.x,this.P=t.y;const i=Math.abs(this.W-this.S),s=Math.abs(this.P-this.z);i/s>o||0===s||s>i&&s-i<n?(t.event.preventDefault(),this.wt(this.M),this.B(),this.ft()):this.K();}}J(t){this.k&&t.id===this._&&this.K();}K(){this.k=!1,this._=void 0,this.wt(this.M),window.removeEventListener("touchmove",this),window.removeEventListener("mousemove",this),window.removeEventListener("touchend",this),window.removeEventListener("mouseup",this),window.removeEventListener("touchcancel",this),this.kt();}wt(t){const i=Date.now();for(;this.G.length>0&&!(i-this.G[0].time<=100);)this.G.shift();this.G.push({x:t,time:i});}ft(){this.F||requestAnimationFrame(this.xt.bind(this)),this.F=!0;}xt(){const t=this.v+this.W-this.M;let i,s;if(this.c.forEach((e,o)=>{e.position>=t&&(void 0===s||e.position<s)&&(s=e.position,i=o);}),this.d){let t;if(void 0===i){const s=this.c.slice(0).sort((t,i)=>t.layoutIndex>i.layoutIndex)[0];for(i=s.layoutIndex-1;i<0;)i+=this.c.length;i%=this.c.length,t=s.layoutIndex-2;}else t=this.c[i].layoutIndex-1;const s=[],e=t+this.slidesPerView+2;for(let i=t;i<e;i++)s.push(i);this.st(s);}else i=i||0;this.L=this.c[i].layoutIndex,this.gt(t),this.M=this.W,this.C=this.P,this.F=!1;}kt(){this.N=!0;const t=this.G[this.G.length-1],i=this.G[0],o=t.x-i.x||0;this.u=Math.floor(this.L/this.c.length);const a=this.ut(this.L);let n;if(0===o)this.T=0,n=this.c[a].position-this.v>this.b/2?this.ht(a):a;else{this.T=function(t,i,s){if(0===t)throw new RangeError("x must be different from `0`");return t/Math.abs(t)*clamp(Math.abs(t),i,s)}(o,this.$,this.I);let t=1;const i=this.g*s;for(;Math.abs(o)>i*t&&t<this.slidesPerView+e;)t+=1;o>0&&(t-=1);let r=a;for(let i=0;i<t;i++)r=o<0?this.ht(r):this.rt(r);n=r;}this.selected=clamp(n,0,this.l),requestAnimationFrame(this.yt.bind(this));}yt(){if(!this.N)return;const t=this.c[this.selected].position;this.T+=this.D*(t-this.v),this.T*=this.A;const i=this.v+this.T;(Math.abs(t-i)>=1||Math.abs(this.T)>=1)&&!this.reducedMotion?(this.gt(i),requestAnimationFrame(this.yt.bind(this))):(this.gt(t),this.N=!1,this.O(),requestAnimationFrame(()=>{this.H(),this.R(),this.X();}));}});class MacroCarouselButton extends HTMLElement{constructor(){super();const t=Object.getPrototypeOf(this).constructor.template;this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(t.content.cloneNode(!0));}connectedCallback(){window.ShadyCSS&&window.ShadyCSS.styleElement(this),this._t=0,this.hasAttribute("role")||this.setAttribute("role","button"),this.hasAttribute("tabindex")?this._t=this.getAttribute("tabindex"):this.setAttribute("tabindex",this._t),this.j("disabled"),this.addEventListener("keydown",this),this.addEventListener("click",this);}j(t){if(this.hasOwnProperty(t)){const i=this[t];delete this[t],this[t]=i;}}static get observedAttributes(){return ["disabled"]}set disabled(t){booleanSetter(this,"disabled",t);}get disabled(){return booleanGetter(this,"disabled")}attributeChangedCallback(t,i,s){switch(t){case"disabled":if(i===s)return;this.disabled?(this._t=this.getAttribute("tabindex"),this.removeAttribute("tabindex"),this.setAttribute("aria-disabled","true")):(this.setAttribute("tabindex",this._t),this.setAttribute("aria-disabled","false"));}}handleEvent(t){this.disabled?t.preventDefault():"click"===t.type?this.St&&this.St():"keydown"!==t.type||32!==t.keyCode&&13!==t.keyCode||(t.preventDefault(),this.St&&this.St());}}const r=document.createElement("template");r.innerHTML='<style>:host{--macro-carousel-navigation-color:#000;--macro-carousel-navigation-color-focus:var(--macro-carousel-navigation-color);--macro-carousel-navigation-color-background:transparent;--macro-carousel-navigation-color-background-focus:#f0f0f0;--macro-carousel-navigation-button-size:48px;--macro-carousel-navigation-icon-size:24px;--macro-carousel-navigation-icon-mask:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\'/%3E%3C/svg%3E");position:relative;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;min-width:var(--macro-carousel-navigation-button-size);min-height:var(--macro-carousel-navigation-button-size);border-radius:50%;overflow:hidden;cursor:pointer;contain:paint}:host([disabled]){opacity:.2}.bg,.content{position:absolute;top:0;right:0;bottom:0;left:0}.content{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;background-color:var(--macro-carousel-navigation-color-background)}.bg{z-index:0;background-color:var(--macro-carousel-navigation-color-background-focus);opacity:0;will-change:opacity}.icon{position:relative;z-index:1;width:var(--macro-carousel-navigation-icon-size);height:var(--macro-carousel-navigation-icon-size);color:var(--macro-carousel-navigation-color);background:var(--macro-carousel-navigation-icon-mask)}@supports ((-webkit-mask-image:var(--macro-carousel-navigation-icon-mask)) or (mask-image:var(--macro-carousel-navigation-icon-mask))){.icon{background:var(--macro-carousel-navigation-color);-webkit-mask-image:var(--macro-carousel-navigation-icon-mask);mask-image:var(--macro-carousel-navigation-icon-mask)}}:host([flipped]) .icon{-webkit-transform:rotate(180deg);transform:rotate(180deg)}:host(.focus-visible) .bg,:host(:active:not([disabled])) .bg,:host(:focus:not([disabled])) .bg,:host(:hover:not([disabled])) .bg{opacity:1}:host-context(.js-focus-visible):host(:focus:not(:active):not(:hover):not(.focus-visible)) .bg{opacity:0}@supports ((-webkit-mask-image:var(--macro-carousel-navigation-icon-mask)) or (mask-image:var(--macro-carousel-navigation-icon-mask))){:host(.focus-visible) .icon,:host(:active:not([disabled])) .icon,:host(:focus:not([disabled])) .icon,:host(:hover:not([disabled])) .icon{background:var(--macro-carousel-navigation-color-focus)}:host-context(.js-focus-visible):host(:focus:not(:active):not(:hover):not(.focus-visible)) .icon{background:var(--macro-carousel-navigation-color)}}</style> <div class="content"> <div class="bg"></div> <div class="icon"></div> </div> ',window.ShadyCSS&&window.ShadyCSS.prepareTemplate(r,"macro-carousel-nav-button");window.customElements.define("macro-carousel-nav-button",class MacroCarouselNavButton extends MacroCarouselButton{static get template(){return r}St(){this.dispatchEvent(new CustomEvent("macro-carousel-nav-button-clicked"));}});const h=document.createElement("template");h.innerHTML='<style>:host{--macro-carousel-pagination-color:#999;--macro-carousel-pagination-color-selected:#000;--macro-carousel-pagination-size-clickable:24px;--macro-carousel-pagination-size-dot:8px;--macro-carousel-pagination-border:1px solid var(--macro-carousel-pagination-color);--macro-carousel-pagination-border-selected:1px solid var(--macro-carousel-pagination-color-selected);position:relative;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;width:var(--macro-carousel-pagination-size-clickable);height:var(--macro-carousel-pagination-size-clickable);overflow:hidden;cursor:pointer;contain:paint}.bg,.fg,:host{border-radius:50%}.bg,.fg{position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);display:block;width:var(--macro-carousel-pagination-size-dot);height:var(--macro-carousel-pagination-size-dot);-webkit-box-sizing:border-box;box-sizing:border-box;background-color:var(--macro-carousel-pagination-color);content:""}.bg{-webkit-transform:translate(-50%,-50%) scale(2);transform:translate(-50%,-50%) scale(2);opacity:0;will-change:opacity}.fg{border:var(--macro-carousel-pagination-border)}:host(.focus-visible) .bg,:host(:hover) .bg{opacity:.2}:host(.selected) .fg{background-color:var(--macro-carousel-pagination-color-selected);border:var(--macro-carousel-pagination-border-selected)}</style> <div class="bg"></div> <div class="fg"></div> ',window.ShadyCSS&&window.ShadyCSS.prepareTemplate(h,"macro-carousel-pagination-indicator");window.customElements.define("macro-carousel-pagination-indicator",class MacroCarouselPaginationIndicator extends MacroCarouselButton{static get template(){return h}St(){this.dispatchEvent(new CustomEvent("macro-carousel-pagination-indicator-clicked"));}});}();

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

  class SitePhotos extends litElement.LitElement {
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
      return litElement.css`
      macro-carousel {
        padding: 0 3em;
        max-width: 75vw;
        margin: 0 auto;
      }
      .slide {
        height: 40vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .slide img {
        max-width: 100%;
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
      return litElement.html`
    ${(!this.photos)?'':litElement.html`
    <macro-carousel navigation pagination>
    <slot>
      ${this.photos.map((el) => (!el.FileURL)?'':litElement.html`
      <div class="slide" title="Double-click to expand">
        <img 
          src="${el.FileURL}"
          alt="${el.Description}"
          @dblclick="${this.handleImageClick}"
        />

        ${(!el.Image_Number)?'':litElement.html`
        <div class="title text">
          <p>
            PP${el.Image_Number}
          </p>
        </div>
        `}

        ${(!el.Description)?'':litElement.html`
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

  class SiteDetails extends litElement.LitElement {
    static get properties() {
      return {
        siteinfo: {
          type: Object
        },
        photos: {
          type: Array
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
      return litElement.css`
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
        padding: var(--font-size-extra-large);
        z-index: 10;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
      }
      .header h1 {
        padding: 0;
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
    `;
    }

    get renderTable() {
      let key = 0, value = 1;
      return Object.entries(this.siteinfo).filter((el, index) => {
        return !ignoredKeys.includes(el[key]);
      }).map((el, index) => litElement.html`
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
      return litElement.html`
      <style>
        @import url("./css/typography.css");
      </style>

      ${(!this.siteinfo)? '' : litElement.html`
        <div class="header">
          <span>
            <a href="${window.router.router.link('/view/' + this.siteinfo.Site_Code)}" onclick="event.preventDefault()"><i class="material-icons toggle-print" title="Back to website" @click="${this.fireTogglePrint}" ?data-closed="${!this.printLayout}">arrow_back</i></a>
            <a href="${window.router.router.link('/')}" onclick="event.preventDefault()"><i class="material-icons clear-selection" title="Clear selection" @click="${this.fireClearSelection}" ?data-closed="${this.printLayout}">arrow_back</i></a>
          </span>
          <h1>${this.siteinfo.County} County Spring #${this.siteinfo.SpringID}</h1>
          <span>
            <a href="${window.router.router.link('/print/' + this.siteinfo.Site_Code)}" onclick="event.preventDefault()"><i class="material-icons toggle-print" title="Print layout" @click="${this.fireTogglePrint}" ?data-closed="${this.printLayout}">zoom_out_map</i></a>
            <i class="material-icons print-action" title="Print this page" @click="${this.handlePrint}" ?data-closed="${!this.printLayout}">print</i>
          </span>
        </div>
        <site-photos .photos="${this.photos}" ?print-layout="${this.printLayout}"></site-photos>
        <slot ?data-closed="${this.printLayout}" name="sketch"></slot>
        <app-collapsible open>
          <i slot="header-before" class="material-icons" title="Water quality">bar_chart</i>
          <span slot="header">Water quality</span>
          <i slot="header-after" class="material-icons">expand_more</i>
          <div slot="content">
            <site-water-quality .siteinfo="${this.siteinfo}"></site-water-quality>
          </div>
        </app-collapsible>
        <app-collapsible open>
          <i slot="header-before" class="material-icons" title="Spring-bed materials">bar_chart</i>
          <span slot="header">Spring-bed materials</span>
          <i slot="header-after" class="material-icons">expand_more</i>
          <div slot="content">
            <site-bed-materials .siteinfo="${this.siteinfo}"></site-bed-materials> 
          </div>
        </app-collapsible>
        <app-collapsible ?open="${this.printLayout}">
          <i slot="header-before" class="material-icons" title="All data">view_list</i>
          <span slot="header">All data</span>
          <i slot="header-after" class="material-icons">expand_more</i>
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

  let formatDate = function formatDate(item) {
    return (!item) ?
      null :
      new Date(item).toISOString().substring(0,10);
  };

  let roundToTwoDecimals = function roundToTwoDecimals(item) {
    return (!item) ?
      null :
      item.toFixed(2);
  };


  let ignoredKeys = [
    'OBJECTID',
    'GlobalID',
    'File_Prefix',
    'Site_Code',
    'SpringID',
    'Surveyor',
    'Time',
    'Horz_Precision_m',
    'Max_PDOP',
    'Access',
    'Ease_Access',
    'Notes',
    'gps_time_date',
    'sat_signals'
  ];
  let keyLookup = {
    'pH': { 'title': 'pH', 'desc': 'Measured as close to spring source as possible.' },
    'Conductivity_uS': { 'title': 'Specific Conductance (µmho/cm)', 'desc': 'Measured as close to spring source as possible (µmho/cm).' },
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

  let pdfjsLib = window['pdfjs-dist/build/pdf'];

  class SiteSketch extends litElement.LitElement {
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
      return litElement.css`
      div {
        min-height: 10em;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: space-between;

      }
      img {
        max-height: 70vh;
      }
    `;
    }

    render() {
      return litElement.html`
    <div>
      ${(!this.imgsrc)?litElement.html`
        <app-spinner></app-spinner>
      `:litElement.html`
      <img src="${this.imgsrc}" />
      `}
      <download-section file="${this.pdfsrc}"></download-section>
    </div>
    `;
    }

    updated(old) {
      var el = this;
      if (old.has('pdfsrc')) {
        if (el.pdfsrc) {
          el.buildImgSrc().then(function(url) {
            el.imgsrc = url;
          });
        } else {
          el.imgsrc = null;
        }
      }
    }
  }
  customElements.define('site-sketch', SiteSketch);

  class SiteSketchPanel extends litElement.LitElement {
    static get properties() {
      return {

      };
    }

    constructor() {
      super();
    }

    static get styles() {
      return litElement.css`
    :host {
      min-height: 10em;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    `;
    }

    render() {
      return litElement.html`
      <slot></slot>
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

  class SiteSketchButton extends litElement.LitElement {
    static get properties() {
      return {
        buttonText: String,
      };
    }

    constructor() {
      super();
      this.closed=true;
      this.buttonText="chevron_right";
    }

    static get styles() {
      return litElement.css`
    `;
    }

    render() {
      return litElement.html`
    <style>
      @import url("./css/typography.css");
    </style>
    <app-collapsible @click="${this.toggle}" onclick="event.preventDefault()">
      <i slot="header-before" class="material-icons" title="Site sketch map">picture_as_pdf</i>
      <span slot="header">Site sketch map</span>
      <i slot="header-after" class="material-icons">${this.buttonText}</i>
    </app-collapsible>
    `;
    }

    toggle() {
      this.closed = !this.closed;
      this.buttonText = (this.closed)?"chevron_right":"chevron_left";
      this.dispatchEvent(new CustomEvent('toggle-sketch', {bubbles: true, detail: {closed: this.closed}}));
    }
  }
  customElements.define('site-sketch-button', SiteSketchButton);

  class MapControls extends litElement.LitElement {
    static get properties() {
      return {

      };
    }

    constructor() {
      super();
    }

    static get styles() {
      return litElement.css`
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
      return litElement.html`
      <style>
        @import url("./css/typography.css");
      </style>
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

  class MapControlItem extends litElement.LitElement {
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
      return litElement.css`

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
      return litElement.html`
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
          }      });
      });
    }
  }
  customElements.define('map-control-item', MapControlItem);

  exports.AppCollapsible = AppCollapsible;
  exports.AppSidebar = AppSidebar;
  exports.MapControls = MapControls;
  exports.SiteDetails = SiteDetails;
  exports.SiteSketch = SiteSketch;
  exports.SiteSketchButton = SiteSketchButton;
  exports.SiteSketchPanel = SiteSketchPanel;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
