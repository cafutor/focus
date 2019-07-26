"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.RouteScope = exports.route = exports.Scope = exports.Switch = exports.View = exports.Text = exports.getModel = exports.updateModel = exports.getComponent = exports.saveReduxStore = exports.isUseReduxStore = exports.saveRootModelPropsSet = exports.saveRootElement = void 0;

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _eventCenter = _interopRequireDefault(require("../eventCenter"));

var _reactRouterDom = require("react-router-dom");

var _utils = require("../utils");

var eventCenter = new _eventCenter["default"]();
var $focus__used__component__set = [];
var $select_store_state_to_props_list = [];
var $focus__used__root__element = null;
var $focus_model_props_set = null;
var $focus_is_use_redux_store = false;
var $focus_redux_store = null; // get seletStoreStateToProps cb

var seletStoreStateToPropsFun = function seletStoreStateToPropsFun(selectStoreStateToPropsList, componentId) {
  for (var i = 0, len = selectStoreStateToPropsList.length; i < len; i++) {
    if (componentId === selectStoreStateToPropsList[i].componentId) return selectStoreStateToPropsList[i].selectStoreStateToProps;
  }
}; // save root element


var saveRootElement = function saveRootElement(focusRootElement) {
  $focus__used__root__element = focusRootElement;
}; // component set that uses model,a props set


exports.saveRootElement = saveRootElement;

var saveRootModelPropsSet = function saveRootModelPropsSet(rootModelJson) {
  $focus_model_props_set = rootModelJson;
}; // is use redux store


exports.saveRootModelPropsSet = saveRootModelPropsSet;

var isUseReduxStore = function isUseReduxStore(_isUseReduxStore) {
  $focus_is_use_redux_store = _isUseReduxStore;
}; // save redux store


exports.isUseReduxStore = isUseReduxStore;

var saveReduxStore = function saveReduxStore(store) {
  $focus_redux_store = store;
};

exports.saveReduxStore = saveReduxStore;

var getComponent = function getComponent(componentId) {
  if (Object.prototype.toString.call(componentId) !== '[object String]' || !componentId.trim()) {
    throw new Error("component id error:".concat(componentId));
  }

  ;

  function setProps(partialState, didUpdate) {
    var _this = this;

    if ($focus__used__component__set.every(function (comInst) {
      return comInst.componentId !== componentId;
    })) throw new Error("can not find component ".concat(componentId, " !"));
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
  }

  ;
  var component = {
    selectStoreStateToProps: function selectStoreStateToProps(cb) {
      $select_store_state_to_props_list.push({
        componentId: componentId,
        selectStoreStateToProps: cb
      });
      return this;
    },
    getProps: function getProps() {
      if ($focus__used__component__set.every(function (comInst) {
        return comInst.componentId !== componentId;
      })) throw new Error("can not find component ".concat(componentId, " !"));
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

  component.setProps = function (partialState, didUpdate) {
    if ($focus_is_use_redux_store) setProps(partialState, didUpdate);
    throw new Error("warning:setProps is invalid if there is a redux store,\n        you sholud use redux store to manage your whole state.\n        error @component:".concat(componentId, "\n        "));
  }.bind(component);

  return component;
};

exports.getComponent = getComponent;

var updateModel = function updateModel(partialState, didUpdate) {
  if ($focus_is_use_redux_store && $focus_redux_store) {
    var subscribeFun = arguments[0];

    if (typeof subscribeFun === 'function' && $focus_redux_store) {
      subscribeFun($focus_redux_store.dispatch);
    }

    ;
  } else {
    if ($focus__used__root__element) $focus__used__root__element.setState(partialState, function () {
      didUpdate && didUpdate($focus__used__root__element.state);
    });
  }
};

exports.updateModel = updateModel;

var getModel = function getModel() {
  if ($focus__used__root__element) return $focus__used__root__element.state;
}; // ignore special props for text type


exports.getModel = getModel;

var ignoreRouteProp = function ignoreRouteProp() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var propSet = ['computedMatch', 'history', 'location', 'match', 'link', 'routeScope', 'switch'];
  var props = {};

  for (var i in obj) {
    if (!propSet.indexOf(i) < 0) {
      props[i] = obj[i];
    }
  }

  ;
  return props;
}; // 基础组件


var Text =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2["default"])(Text, _React$Component);

  function Text(props) {
    var _this2;

    (0, _classCallCheck2["default"])(this, Text);
    _this2 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Text).call(this, props));
    _this2.invalidEl = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div', 'dd', 'dt'];
    return _this2;
  }

  (0, _createClass2["default"])(Text, [{
    key: "render",
    value: function render() {
      var _ignoreRouteProp = ignoreRouteProp(this.props),
          _ignoreRouteProp$type = _ignoreRouteProp.type,
          type = _ignoreRouteProp$type === void 0 ? 'span' : _ignoreRouteProp$type,
          visible = _ignoreRouteProp.visible,
          value = _ignoreRouteProp.value,
          otherProps = (0, _objectWithoutProperties2["default"])(_ignoreRouteProp, ["type", "visible", "value"]);

      if (this.invalidEl.some(function (el) {
        return el === type;
      })) {
        return visible ? _react["default"].createElement(type, otherProps, value) : null;
      }

      ;
      return null;
    }
  }]);
  return Text;
}(_react["default"].Component);

exports.Text = Text;
(0, _defineProperty2["default"])(Text, "defaultProps", {
  visible: true
});
;

var View = function View(_ref) {
  var className = _ref.className,
      children = _ref.children;
  return _react["default"].createElement("div", {
    className: className ? "focus-view ".concat(className) : 'focus-view'
  }, children);
};

exports.View = View;

var Switch = function Switch(_ref2) {
  var children = _ref2.children,
      otherProps = (0, _objectWithoutProperties2["default"])(_ref2, ["children"]);
  return _react["default"].createElement(_reactRouterDom.HashRouter, null, _react["default"].createElement(_reactRouterDom.Switch, otherProps, children));
};

exports.Switch = Switch;

var Scope = function Scope(props) {
  var className = props.className,
      id = props.id,
      children = props.children;
  return _react["default"].createElement("div", {
    className: className,
    id: id
  }, children);
};

exports.Scope = Scope;

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
    function (_React$Component2) {
      (0, _inherits2["default"])(_class, _React$Component2);

      function _class() {
        (0, _classCallCheck2["default"])(this, _class);
        return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(_class).apply(this, arguments));
      }

      (0, _createClass2["default"])(_class, [{
        key: "render",
        value: function render() {
          var _this3 = this;

          var _this$props = this.props,
              exact = _this$props.exact,
              path = _this$props.path,
              children = _this$props.children;
          return _react["default"].createElement(_reactRouterDom.HashRouter, null, _react["default"].createElement(_reactRouterDom.Route, (0, _extends2["default"])({
            exact: exact,
            path: path
          }, {
            component: function component(_props) {
              return _react["default"].createElement(Com, Object.assign({
                link: _reactRouterDom.Link,
                "switch": Switch,
                route: _reactRouterDom.Route,
                children: Com === routeScope ? children : null
              }, ignoreSpecialProps(_this3.props), _props));
            }
          })));
        }
      }]);
      return _class;
    }(_react["default"].Component)
  );
};

exports.route = route;

var routeScope = function routeScope(props) {
  var className = props.className,
      id = props.id,
      _props$children = props.children,
      children = _props$children === void 0 ? [] : _props$children,
      computedMatch = props.computedMatch,
      history = props.history,
      location = props.location,
      match = props.match;
  return _react["default"].createElement("div", {
    className: className,
    id: id
  }, _react["default"].Children.map(children, function (child) {
    var routeHistory = (0, _objectSpread2["default"])({
      computedMatch: computedMatch,
      history: history,
      location: location,
      match: match,
      link: _reactRouterDom.Link,
      routeScope: RouteScope,
      "switch": Switch
    }, child.props || {});
    if (typeof child === 'string') return child;
    return _react["default"].cloneElement(child, routeHistory);
  }));
};

var RouteScope = route(routeScope);
exports.RouteScope = RouteScope;

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
      var _this4$props2 = _this4.props,
          _id = _this4$props2.id,
          _focusInternalInstanceId = _this4$props2.__focusInternalInstanceId;

      if (Object.prototype.toString.call(_id) !== '[object String]' || !_id.trim()) {
        throw new Error("if you use @focus decorator to describe the component,there must be a id prop,error @component:".concat(Com.name, " please check your *.view file"));
      }

      ;

      if (_this4.props.children || _this4.props.children && _this4.props.children.length === 0) {
        _this4.props.children = null;
      }

      if ($focus_redux_store && _focusInternalInstanceId) {
        throw new Error("if you use redux store,you must not use @model to mark your state,you sholud use getComponent($id).selectStoreStateToProps instead.\n                @component:".concat(_id));
      }

      ;
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
        if ($focus_is_use_redux_store) {
          var componentId = this.props.id;
          var selectStoreStateToProps = seletStoreStateToPropsFun($select_store_state_to_props_list, componentId);

          if ($focus_redux_store && typeof selectStoreStateToProps === 'function') {
            var partialProps = selectStoreStateToProps($focus_redux_store.getState());
            return _react["default"].createElement(Com, (0, _extends2["default"])({
              ref: this.saveComponentsMap
            }, (0, _objectSpread2["default"])({}, this.props, partialProps, {
              emmit: this.emmit,
              changeProps: this.changeProps
            })));
          }

          ;
        }

        ;
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