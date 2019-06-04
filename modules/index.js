(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@sibley/app-component')) :
  typeof define === 'function' && define.amd ? define(['exports', '@sibley/app-component'], factory) :
  (global = global || self, factory(global.index = {}, global.AppComponent));
}(this, function (exports, appComponent) { 'use strict';

  var tpl = "<style> @import url(\"./css/reset.css\");\n  @import url(\"./css/variables.css\");\n  @import url(\"./css/typography.css\");\n\n  :host {\n    padding: 0 1.5em 1.5em 1.5em;\n  }\n\n  .header {\n    position: -webkit-sticky;\n    position: sticky;\n    top: 0px;\n    background-color: var(--palette-white);\n    padding: 1em;\n  }\n\n  [data-element=views] {\n    display: grid;\n    grid-template-columns: 33% 33% 33%;\n  } </style> <h1 class=\"header\">{{title}}</h1> <div>The current time is <span>{{trackTime}}</span></div> <in-radio data-element=\"views\" in-name=\"view\" choices='[\"default\",\"filter\",\"details\"]'></in-radio> <slot></slot> <slot name=\"filter\" hidden></slot> <slot name=\"details\" hidden></slot> <div>Last refresh: {{renderTime}}</div> ";

  class AppSidebar extends appComponent.AppComponent {
    constructor() {
      super();
      appComponent.AppComponent.init(this, AppSidebar, tpl);

      this.data.renderTime = function() {
        return new Date();
      };

      var track = (function() {
        this.data.trackTime = this.data.renderTime();
      }).bind(this);
      setInterval(track, 1000);
    }

    get eventListeners() {
      return [
        ['attributechange', 'in-radio', (function(event) {
          this.switchTab(this.$views.getAttribute('choice'));
        }).bind(this)]
      ];
    }

    switchTab(choice) {
      if (choice !== this.$views.getAttribute('choice')) {
        this.$views.setAttribute('choice', choice);
        return;
      }
      this.shadowRoot.querySelectorAll('slot').forEach((el) => {
        if ((choice === 'default' && !el.getAttribute('name')) || (el.getAttribute('name') === choice)) {
          el.hidden = false;
        } else {
          el.hidden = true;
        }
      });
    }

    static get observedAttributes() {
      return ['title'];
    }
  }

  window.customElements.define('app-sidebar', AppSidebar);

  // https://gist.github.com/gordonbrander/2230317
  const genId = function() {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  var tpl$1 = "<template data-element=\"choiceTpl\"> <div class=\"choice\"><input type=\"radio\" name=\"{{name}}\" id=\"{{id}}\" value=\"{{choice}}\"><label for=\"{{id}}\">{{choice}}</label></div> </template> ";

  class InRadio extends appComponent.AppComponent {
    constructor() {
      super();
      appComponent.AppComponent.init(this, InRadio, tpl$1);

      this.observedAttributes['choices'].push(this.renderChoices.bind(this));
      this.observedAttributes['choice'].push((function(prop, val) {
        this.setAttribute(prop, this.serializeAttribute(val));
        const option = this.shadowRoot.querySelector('[value='+this.data.choice+']');
        if (option) {
          option.checked = true;
        }
      }).bind(this));

      this.on('attributechange', (function(){
        this.dispatchEvent(
          new CustomEvent('attributechange', {
            bubbles: true,
            cancelable: true
          })
        );
      }).bind(this));
    }

    get eventListeners() {
      const thing = (function(event) {
        const selected = this.shadowRoot.querySelector(':checked');
        this.data.choice = selected.getAttribute('value');
      }).bind(this);
      return [['click', 'input', thing]];
    }

    renderChoices() {
      const container = this.shadowRoot,
        template = this.$choiceTpl,
        name = this.data['in-name'],
        choices = this.data.choices;

      if (!container || !template || !name || !choices) {
        return;
      }

      container.querySelectorAll('.choice').forEach((el) => {el.remove();});

      let checked = false;
      for (let choice of choices) {
        let tplb = appComponent.AppComponent.stashe(template.content.cloneNode(true));
        let context = {};
        context.id = genId();
        context.name = name;
        context.choice = choice;
        let result = tplb(context);
        let $input = result.querySelector('input');
        if (!checked) {
          $input.checked = true;
          checked = true;
          this.data.choice = choice;
        }
        container.appendChild(result);
      }
    }

    static get observedAttributes() {
      return ['in-name', 'choices', 'choice'];
    }
  }

  window.customElements.define('in-radio', InRadio);

  var tpl$2 = "<style> @import url(\"./css/reset.css\");\n  @import url(\"./css/variables.css\");\n  @import url(\"./css/typography.css\");\n\n  [data-element=\"table\"] {\n    display: grid;\n    grid-template-columns: 30% 70%;\n    grid-gap: 0.5em;\n  }\n\n  td {\n    padding: 0.5em;\n  }\n\n  .label {\n    background-color: var(--palette-dark);\n    font-weight: var(--font-weight-bold);\n  }\n\n  .detail {\n    background-color: var(--palette-light);\n  } </style> <h1>{{siteinfo.County}} County Spring #{{siteinfo.SpringID}}</h1> <template data-element=\"rowTpl\"> <td class=\"label\"><label for=\"{{id}}\">{{key}}</label></td><td class=\"detail\"><span id=\"{{id}}\">{{value}}</span></td> </template> <div data-element=\"table\"></div>";

  class SiteDetails extends appComponent.AppComponent {
    constructor() {
      super();
      appComponent.AppComponent.init(this, SiteDetails, tpl$2);

      this.observedAttributes['siteinfo'].push(this.renderTable.bind(this));
    }

    static get observedAttributes() {
      return [
        'siteinfo'
      ];
    }

    renderTable() {
      const container = this.$table,
      template = this.$rowTpl;
      if (!container || !template || !this.data.siteinfo ) {
        return;
      }
      container.querySelectorAll('*').forEach((el) => {el.remove();});

      for (const [key, value] of Object.entries(this.data.siteinfo)) {
        let tplb = appComponent.AppComponent.stashe(template.content.cloneNode(true));
        let context = {};
        context.id = genId();
        context.key = key;
        context.value = value;
        let result = tplb(context);
        container.appendChild(result);
      }
    }
  }

  window.customElements.define('site-details', SiteDetails);

  exports.AppSidebar = AppSidebar;
  exports.InRadio = InRadio;
  exports.SiteDetails = SiteDetails;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
