"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.route = exports.View = exports.Scope = exports.Text = exports.getModel = exports.updateModel = exports.getComponent = exports.saveRootModelPropsSet = exports.saveRootElement = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireDefault(require("react"));

var _eventCenter = _interopRequireDefault(require("./event-center"));

var _reactRouterDom = require("react-router-dom");

var _utils = require("./utils");

var eventCenter = new _eventCenter["default"]();
var $focus__used__component__set = [];
var $focus__used__root__element = null;
var $focus_model_props_set = null; // save root element

var saveRootElement = function saveRootElement(focusRootElement) {
  $focus__used__root__element = focusRootElement;
}; // component set that uses model,a props set


exports.saveRootElement = saveRootElement;

var saveRootModelPropsSet = function saveRootModelPropsSet(rootModelJson) {
  $focus_model_props_set = rootModelJson;
};

exports.saveRootModelPropsSet = saveRootModelPropsSet;

var getComponent = function getComponent(componentId) {
  var component = {
    setProps: function setProps(partialState, didUpdate) {
      var _this = this;

      $focus__used__component__set.forEach(function (comObj) {
        // debugger;
        if (comObj.componentId === componentId) {
          //  如果整个组件没被$model标记，则走更新state
          if (!comObj.__focusInternalInstanceId) {
            comObj.parentRef.setState(partialState, function () {
              if (didUpdate && Object.prototype.toString.call(didUpdate) === '[object Function]') didUpdate(_this.getProps());
            });
          } else {
            var partialStateKeys = Object.keys(partialState);
            /****
             * 
             * 找到所有此component的prop被model引用的key
             * 
             * **/

            var filterPropSet = $focus_model_props_set.filter(function (propEl) {
              return propEl.__focusInternalInstance === comObj.__focusInternalInstanceId;
            });
            /***
             * 
             * 找到此次更新中被model标记的prop
             * 然后执行更新
             * 
             * */

            var partialStateForModel = partialStateKeys.reduce(function (initialObjValue, partialStateKey) {
              if (filterPropSet.some(function (filterPropSetEl) {
                return filterPropSetEl.prop === partialStateKey;
              })) {
                initialObjValue[partialStateKey] = partialState[partialStateKey];
              }

              ;
              return initialObjValue;
            }, {});
            if (!(0, _utils.isObjEmpty)(partialStateForModel)) updateModel(partialStateForModel, function () {
              if (didUpdate && Object.prototype.toString.call(didUpdate) === '[object Function]') didUpdate(_this.getProps());
            });
            /****
             * 
             * 找到此次更新中没被model标记的prop
             * 
             * ***/

            var usefulState = partialStateKeys.reduce(function (initialValue, stateKey) {
              if (filterPropSet.every(function (propEl) {
                return propEl.prop !== stateKey;
              })) {
                initialValue[key] = partialState[key];
              }

              ;
              return initialValue;
            }, {});
            if (!(0, _utils.isObjEmpty)(usefulState)) comObj.parentRef.setState(usefulState, function () {
              if (didUpdate && Object.prototype.toString.call(didUpdate) === '[object Function]') didUpdate(_this.getProps());
            });
          }
        }
      });
    },
    getProps: function getProps() {
      var propsWithoutFunc = {};
      var ref = $focus__used__component__set.filter(function (comObj) {
        return comObj.componentId === componentId;
      })[0].ref;
      var _ref$props = ref.props,
          props = _ref$props === void 0 ? {} : _ref$props;

      for (var i in props) {
        if (Object.prototype.toString.call(props[i]) !== '[object Function]') {
          propsWithoutFunc[i] = props[i];
        }
      }

      ;
      return propsWithoutFunc;
    }
  };

  component.subscribe = function (cb) {
    var func = function (eventAction) {
      cb(eventAction, this);
    }.bind(this);

    eventCenter.on("".concat(componentId, "-event"), func);
  }.bind(component);

  return component;
};

exports.getComponent = getComponent;

var updateModel = function updateModel(partialState, didUpdate) {
  if ($focus__used__root__element) $focus__used__root__element.setState(partialState, function () {
    didUpdate && didUpdate($focus__used__root__element.state);
  });
};

exports.updateModel = updateModel;

var getModel = function getModel() {
  if ($focus__used__root__element) return $focus__used__root__element.state;
}; // 基础组件


exports.getModel = getModel;

var Text =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2["default"])(Text, _React$Component);

  function Text(props) {
    var _this2$typeMap;

    var _this2;

    (0, _classCallCheck2["default"])(this, Text);
    _this2 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Text).call(this, props));
    _this2.typeMap = (_this2$typeMap = {
      'h1': function h1(_ref) {
        var value = _ref.value,
            className = _ref.className;
        return _react["default"].createElement("h1", {
          className: className
        }, value);
      },
      'h2': function h2(_ref2) {
        var value = _ref2.value,
            className = _ref2.className;
        return _react["default"].createElement("h2", {
          className: className
        }, value);
      },
      'h3': function h3(_ref3) {
        var value = _ref3.value,
            className = _ref3.className;
        return _react["default"].createElement("h3", {
          className: className
        }, value);
      },
      'h4': function h4(_ref4) {
        var value = _ref4.value,
            className = _ref4.className;
        return _react["default"].createElement("h4", {
          className: className
        }, value);
      },
      'h5': function h5(_ref5) {
        var value = _ref5.value,
            className = _ref5.className;
        return _react["default"].createElement("h5", {
          className: className
        }, value);
      }
    }, (0, _defineProperty2["default"])(_this2$typeMap, "h5", function h5(_ref6) {
      var value = _ref6.value,
          className = _ref6.className;
      return _react["default"].createElement("h6", {
        className: className
      }, value);
    }), (0, _defineProperty2["default"])(_this2$typeMap, 'span', function span(_ref7) {
      var value = _ref7.value,
          className = _ref7.className;
      return _react["default"].createElement("span", {
        className: className
      }, value);
    }), (0, _defineProperty2["default"])(_this2$typeMap, 'div', function div(_ref8) {
      var value = _ref8.value,
          className = _ref8.className;
      return _react["default"].createElement("div", {
        className: className
      }, value);
    }), _this2$typeMap);
    return _this2;
  }

  (0, _createClass2["default"])(Text, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          _this$props$type = _this$props.type,
          type = _this$props$type === void 0 ? 'span' : _this$props$type,
          otherProps = (0, _objectWithoutProperties2["default"])(_this$props, ["type"]);
      var Com = this.typeMap[type];
      return _react["default"].createElement(Com, otherProps);
    }
  }]);
  return Text;
}(_react["default"].Component);

exports.Text = Text;
;

var Scope = function Scope(props) {
  return _react["default"].createElement("div", props);
};

exports.Scope = Scope;

var View =
/*#__PURE__*/
function (_React$Component2) {
  (0, _inherits2["default"])(View, _React$Component2);

  function View() {
    (0, _classCallCheck2["default"])(this, View);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(View).apply(this, arguments));
  }

  (0, _createClass2["default"])(View, [{
    key: "render",
    value: function render() {
      var className = this.props.className;
      return _react["default"].createElement("div", {
        className: className ? "focus-view ".concat(className) : 'focus-view'
      }, this.props.children);
    }
  }]);
  return View;
}(_react["default"].Component);

exports.View = View;
;

var route = function route(Com) {
  /**
   * 
   * ignore special props
   * exact|path
   * ***/
  var ignoreSpecialProps = function ignoreSpecialProps() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var correctProps = {};

    for (var i in props) {
      if (Object.prototype.hasOwnProperty.call(props, i)) {
        if (i !== 'exact' && i !== 'path') {
          correctProps[i] = props[i];
        }
      }
    }

    ;
    return correctProps;
  };

  return (
    /*#__PURE__*/
    function (_React$PureComponent) {
      (0, _inherits2["default"])(_class, _React$PureComponent);

      function _class() {
        (0, _classCallCheck2["default"])(this, _class);
        return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(_class).apply(this, arguments));
      }

      (0, _createClass2["default"])(_class, [{
        key: "render",
        value: function render() {
          var _this3 = this;

          var _this$props2 = this.props,
              exact = _this$props2.exact,
              path = _this$props2.path;
          return _react["default"].createElement(_reactRouterDom.HashRouter, null, _react["default"].createElement(_reactRouterDom.Route, (0, _extends2["default"])({
            exact: exact,
            path: path
          }, {
            component: function component(_props) {
              return _react["default"].createElement(Com, Object.assign({
                link: _reactRouterDom.Link,
                router: _reactRouterDom.HashRouter,
                "switch": _reactRouterDom.Switch
              }, ignoreSpecialProps(_this3.props), _props));
            }
          })));
        }
      }]);
      return _class;
    }(_react["default"].PureComponent)
  );
};

exports.route = route;

var focus = function focus(Com) {
  var _temp;

  return _temp =
  /*#__PURE__*/
  function (_React$Component3) {
    (0, _inherits2["default"])(_temp, _React$Component3);

    function _temp(props) {
      var _this4;

      (0, _classCallCheck2["default"])(this, _temp);
      _this4 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(_temp).call(this, props));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this4), "saveComponentsMap", function (comsRef) {
        if (comsRef) {
          var _this4$props = _this4.props,
              id = _this4$props.id,
              __focusInternalInstanceId = _this4$props.__focusInternalInstanceId;

          if ($focus__used__component__set.every(function (comsObj) {
            return comsObj.componentId !== id;
          })) {
            var componentEl = {
              componentId: id,
              ref: comsRef,
              parentRef: (0, _assertThisInitialized2["default"])(_this4),
              __focusInternalInstanceId: __focusInternalInstanceId
            };
            $focus__used__component__set.push(componentEl);
          }
        }
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this4), "changeProps", function (partialState) {
        if (Object.prototype.toString.call(partialState) !== '[object Object]') {
          throw new TypeError('partialState is not a pure object @changeProps');
        }

        ;

        _this4.setState(partialState);
      });

      if (_this4.props.children || _this4.props.children && _this4.props.children.length === 0) {
        _this4.props.children = null;
      }

      _this4.emmit = _this4.emmit.bind((0, _assertThisInitialized2["default"])(_this4));
      return _this4;
    }

    (0, _createClass2["default"])(_temp, [{
      key: "emmit",
      value: function emmit(eventName, params) {
        var id = this.props.id;
        eventCenter.emmit("".concat(id, "-event"), {
          type: eventName,
          params: params
        });
      }
    }, {
      key: "render",
      value: function render() {
        return _react["default"].createElement(Com, (0, _extends2["default"])({
          ref: this.saveComponentsMap
        }, (0, _objectSpread2["default"])({}, this.props, this.state, {
          emmit: this.emmit,
          changeProps: this.changeProps
        })));
      }
    }]);
    return _temp;
  }(_react["default"].Component), _temp;
};

var _default = focus;
exports["default"] = _default;
