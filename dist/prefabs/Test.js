"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Test = Test;
var _BoxBody2D = require("../components/BoxBody2D");
var _GameObject = require("../components/GameObject");
var _Sprite = require("../components/Sprite");
var _Transform = require("../components/Transform");
var _Color = require("../renderer/Color");
var _jsxRuntime = require("react/jsx-runtime");
function Test() {
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_GameObject.GameObject, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Transform.Transform, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Sprite.Sprite, {
      color: _Color.Color.red
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_BoxBody2D.BoxBody2D, {
      isStatic: false,
      gravityScale: 0
    })]
  });
}