(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@sibley/app-component')) :
  typeof define === 'function' && define.amd ? define(['exports', '@sibley/app-component'], factory) :
  (global = global || self, factory(global.bundle = {}, global.AppComponent));
}(this, function (exports, appComponent) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var tpl = "<style> @import url(\"./css/reset.css\");\n  @import url(\"./css/variables.css\");\n  @import url(\"./css/typography.css\");\n\n  :host {\n    padding: 0 1.5em 1.5em 1.5em;\n  }\n\n  .header {\n    position: -webkit-sticky;\n    position: sticky;\n    top: 0px;\n    background-color: var(--palette-white);\n    padding: 1em;\n  }\n\n  [data-element=views] {\n    display: grid;\n    grid-template-columns: 33% 33% 33%;\n  } </style> <h1 class=\"header\">{{title}}</h1> <div>The current time is <span>{{trackTime}}</span></div> <in-radio data-element=\"views\" in-name=\"view\" choices='[\"default\",\"filter\",\"details\"]'></in-radio> <slot></slot> <slot name=\"filter\" hidden></slot> <slot name=\"details\" hidden></slot> <div>Last refresh: {{renderTime}}</div> ";

  var AppSidebar =
  /*#__PURE__*/
  function (_AppComponent) {
    _inherits(AppSidebar, _AppComponent);

    function AppSidebar() {
      var _this;

      _classCallCheck(this, AppSidebar);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(AppSidebar).call(this));
      appComponent.AppComponent.init(_assertThisInitialized(_this), AppSidebar, tpl);

      _this.data.renderTime = function () {
        return new Date();
      };

      var track = function () {
        this.data.trackTime = this.data.renderTime();
      }.bind(_assertThisInitialized(_this));

      setInterval(track, 1000);
      return _this;
    }

    _createClass(AppSidebar, [{
      key: "switchTab",
      value: function switchTab(choice) {
        if (choice !== this.$views.getAttribute('choice')) {
          this.$views.setAttribute('choice', choice);
          return;
        }

        this.shadowRoot.querySelectorAll('slot').forEach(function (el) {
          if (choice === 'default' && !el.getAttribute('name') || el.getAttribute('name') === choice) {
            el.hidden = false;
          } else {
            el.hidden = true;
          }
        });
      }
    }, {
      key: "eventListeners",
      get: function get() {
        return [['attributechange', 'in-radio', function (event) {
          this.switchTab(this.$views.getAttribute('choice'));
        }.bind(this)]];
      }
    }], [{
      key: "observedAttributes",
      get: function get() {
        return ['title'];
      }
    }]);

    return AppSidebar;
  }(appComponent.AppComponent);
  window.customElements.define('app-sidebar', AppSidebar);

  // https://gist.github.com/gordonbrander/2230317
  var genId = function genId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  var tpl$1 = "<template data-element=\"choiceTpl\"> <div class=\"choice\"><input type=\"radio\" name=\"{{name}}\" id=\"{{id}}\" value=\"{{choice}}\"><label for=\"{{id}}\">{{choice}}</label></div> </template> ";

  var InRadio =
  /*#__PURE__*/
  function (_AppComponent) {
    _inherits(InRadio, _AppComponent);

    function InRadio() {
      var _this;

      _classCallCheck(this, InRadio);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(InRadio).call(this));
      appComponent.AppComponent.init(_assertThisInitialized(_this), InRadio, tpl$1);

      _this.observedAttributes['choices'].push(_this.renderChoices.bind(_assertThisInitialized(_this)));

      _this.observedAttributes['choice'].push(function (prop, val) {
        this.setAttribute(prop, this.serializeAttribute(val));
        var option = this.shadowRoot.querySelector('[value=' + this.data.choice + ']');

        if (option) {
          option.checked = true;
        }
      }.bind(_assertThisInitialized(_this)));

      _this.on('attributechange', function () {
        this.dispatchEvent(new CustomEvent('attributechange', {
          bubbles: true,
          cancelable: true
        }));
      }.bind(_assertThisInitialized(_this)));

      return _this;
    }

    _createClass(InRadio, [{
      key: "renderChoices",
      value: function renderChoices() {
        var container = this.shadowRoot,
            template = this.$choiceTpl,
            name = this.data['in-name'],
            choices = this.data.choices;

        if (!container || !template || !name || !choices) {
          return;
        }

        container.querySelectorAll('.choice').forEach(function (el) {
          el.remove();
        });
        var checked = false;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = choices[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var choice = _step.value;
            var tplb = appComponent.AppComponent.stashe(template.content.cloneNode(true));
            var context = {};
            context.id = genId();
            context.name = name;
            context.choice = choice;
            var result = tplb(context);
            var $input = result.querySelector('input');

            if (!checked) {
              $input.checked = true;
              checked = true;
              this.data.choice = choice;
            }

            container.appendChild(result);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }, {
      key: "eventListeners",
      get: function get() {
        var thing = function (event) {
          var selected = this.shadowRoot.querySelector(':checked');
          this.data.choice = selected.getAttribute('value');
        }.bind(this);

        return [['click', 'input', thing]];
      }
    }], [{
      key: "observedAttributes",
      get: function get() {
        return ['in-name', 'choices', 'choice'];
      }
    }]);

    return InRadio;
  }(appComponent.AppComponent);
  window.customElements.define('in-radio', InRadio);

  var tpl$2 = "<style> @import url(\"./css/reset.css\");\n  @import url(\"./css/variables.css\");\n  @import url(\"./css/typography.css\");\n\n  [data-element=\"table\"] {\n    display: grid;\n    grid-template-columns: 30% 70%;\n    grid-gap: 0.5em;\n  }\n\n  td {\n    padding: 0.5em;\n  }\n\n  .label {\n    background-color: var(--palette-dark);\n    font-weight: var(--font-weight-bold);\n  }\n\n  .detail {\n    background-color: var(--palette-light);\n  } </style> <h1>{{siteinfo.County}} County Spring #{{siteinfo.SpringID}}</h1> <template data-element=\"rowTpl\"> <td class=\"label\"><label for=\"{{id}}\">{{key}}</label></td><td class=\"detail\"><span id=\"{{id}}\">{{value}}</span></td> </template> <div data-element=\"table\"></div>";

  var SiteDetails =
  /*#__PURE__*/
  function (_AppComponent) {
    _inherits(SiteDetails, _AppComponent);

    function SiteDetails() {
      var _this;

      _classCallCheck(this, SiteDetails);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SiteDetails).call(this));
      appComponent.AppComponent.init(_assertThisInitialized(_this), SiteDetails, tpl$2);

      _this.observedAttributes['siteinfo'].push(_this.renderTable.bind(_assertThisInitialized(_this)));

      return _this;
    }

    _createClass(SiteDetails, [{
      key: "renderTable",
      value: function renderTable() {
        var container = this.$table,
            template = this.$rowTpl;

        if (!container || !template || !this.data.siteinfo) {
          return;
        }

        container.querySelectorAll('*').forEach(function (el) {
          el.remove();
        });

        for (var _i = 0, _Object$entries = Object.entries(this.data.siteinfo); _i < _Object$entries.length; _i++) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
              key = _Object$entries$_i[0],
              value = _Object$entries$_i[1];

          var tplb = appComponent.AppComponent.stashe(template.content.cloneNode(true));
          var context = {};
          context.id = genId();
          context.key = key;
          context.value = value;
          var result = tplb(context);
          container.appendChild(result);
        }
      }
    }], [{
      key: "observedAttributes",
      get: function get() {
        return ['siteinfo'];
      }
    }]);

    return SiteDetails;
  }(appComponent.AppComponent);
  window.customElements.define('site-details', SiteDetails);

  exports.AppSidebar = AppSidebar;
  exports.InRadio = InRadio;
  exports.SiteDetails = SiteDetails;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
