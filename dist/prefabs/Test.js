"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Test = Test;
var _BoxBody2D = require("../components/BoxBody2D");
var _GameObject = require("../components/GameObject");
var _Script = require("../components/Script");
var _Sprite = require("../components/Sprite");
var _Transform = require("../components/Transform");
var _Color = require("../renderer/Color");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function Test() {
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_GameObject.GameObject, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Transform.Transform, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Sprite.Sprite, {
      color: _Color.Color.red
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_BoxBody2D.BoxBody2D, {
      isStatic: false,
      gravityScale: 0
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Script.Script, {
      import: Promise.resolve().then(() => _interopRequireWildcard(require('../scripts/RotateScript')))
    })]
  });
}