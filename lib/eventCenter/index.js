"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var EventCenter =
/*#__PURE__*/
function () {
  function EventCenter() {
    (0, _classCallCheck2["default"])(this, EventCenter);
    (0, _defineProperty2["default"])(this, "eventSet", []);
    this.emit = this.emmit;
  }

  (0, _createClass2["default"])(EventCenter, [{
    key: "on",
    value: function on(eventName, listener) {
      var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (!eventName || !eventName.replace(/\s/g, '') === '' || typeof eventName !== 'string') {
        throw new TypeError('evnet name is needed and it is value must be a string');
      }

      ;

      if (!listener || typeof listener !== 'function') {
        throw new TypeError('listener is needed and it is value must be a function');
      }

      this.eventSet.push({
        eventName: eventName,
        listener: listener,
        once: once
      });
    }
  }, {
    key: "emmit",
    value: function emmit(eventName, params) {
      for (var i = 0, len = this.eventSet.length; i < len; i++) {
        if (eventName === this.eventSet[i].eventName) {
          this.eventSet[i].listener(params);
        }

        ;
      }

      ;
      this.eventSet = this.eventSet.filter(function (eventObj) {
        return !(eventName === eventObj.eventName && eventObj.once);
      });
    }
  }, {
    key: "once",
    value: function once(eventName, listener) {
      this.on(eventName, listener, true);
    }
  }, {
    key: "offAll",
    value: function offAll(eventName) {
      this.off(eventName, true);
    }
  }, {
    key: "off",
    value: function off(eventName) {
      var offAll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      for (var i = this.eventSet.length - 1; i >= 0; i--) {
        if (this.eventSet[i].eventName === eventName) {
          delete this.eventSet[i];
          if (!offAll) break;
        }
      }

      ;
      this.eventSet = this.eventSet.filter(function (eventObj) {
        return eventObj !== void 0;
      });
    }
  }]);
  return EventCenter;
}();

exports["default"] = EventCenter;