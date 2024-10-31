"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Circle;
var _Sprite = _interopRequireDefault(require("./Sprite"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * 
 * @param {{ color: [number, number, number, number] }} props 
 * @returns 
 */function Circle(props) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Sprite.default, {
    src: "defaultShapes/circle.png",
    color: props.color
  });
}