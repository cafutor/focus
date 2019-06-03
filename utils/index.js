"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.isObjEmpty = void 0;

/***
 * 
 * check if the give obj is empty or not
 * 
 * */
var isObjEmpty = function isObjEmpty(obj) {
  if (!obj || Object.prototype.toString.call(obj) !== '[object Object]') throw new TypeError('the give value is not a pure object');

  for (var i in obj) {
    return false;
  }

  ;
  return true;
};

exports.isObjEmpty = isObjEmpty;
var _default = {};
exports["default"] = _default;
