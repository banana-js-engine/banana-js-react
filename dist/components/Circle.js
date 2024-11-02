"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Circle = Circle;
var _Sprite = require("./Sprite");
var _jsxRuntime = require("react/jsx-runtime");
/**
 * 
 * @param {{ color: [number, number, number, number] }} props 
 * @returns 
 */
function Circle(props) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Sprite.Sprite, {
    src: "defaultShapes/circle.png",
    color: props.color
  });
}