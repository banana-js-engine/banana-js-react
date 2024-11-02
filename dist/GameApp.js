"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = App;
var _Game = _interopRequireDefault(require("./components/Game"));
var _GameObject = _interopRequireDefault(require("./components/GameObject"));
var _Mesh = _interopRequireDefault(require("./components/Mesh"));
var _OrthographicCamera = _interopRequireDefault(require("./components/OrthographicCamera"));
var _Scene = _interopRequireDefault(require("./components/Scene"));
var _Sprite = _interopRequireDefault(require("./components/Sprite"));
var _Transform = _interopRequireDefault(require("./components/Transform"));
var _Animator = _interopRequireDefault(require("./components/Animator"));
var _Animation = _interopRequireDefault(require("./components/Animation"));
var _Script = _interopRequireDefault(require("./components/Script"));
var _Text = _interopRequireDefault(require("./components/Text"));
var _PerspectiveCamera = _interopRequireDefault(require("./components/PerspectiveCamera"));
var _Body2D = _interopRequireDefault(require("./components/Body2D"));
var _Types = require("./core/Types");
var _Cube = _interopRequireDefault(require("./components/Cube"));
var _Circle = _interopRequireDefault(require("./components/Circle"));
var _Color = require("./renderer/Color");
var _Icosphere = _interopRequireDefault(require("./components/Icosphere"));
var _Sphere = _interopRequireDefault(require("./components/Sphere"));
var _Cylinder = _interopRequireDefault(require("./components/Cylinder"));
var _Torus = _interopRequireDefault(require("./components/Torus"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function App() {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Game.default, {
    name: "Development",
    width: 800,
    height: 600,
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Scene.default, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_GameObject.default, {
        name: "Camera",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Transform.default, {
          position: [0, 0, 0]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_OrthographicCamera.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Script.default, {
          import: Promise.resolve().then(() => _interopRequireWildcard(require('./scripts/OrthographicCameraController')))
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.default, {
          children: "HELLO, WORLD"
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_GameObject.default, {
        name: "Square",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Transform.default, {
          position: [0, 3, 0]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Sprite.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Body2D.default, {
          shape: _Types.ShapeType.Box,
          isStatic: false,
          gravityScale: 0
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_GameObject.default, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Transform.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Sprite.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Body2D.default, {
          shape: _Types.ShapeType.Box,
          isStatic: false,
          gravityScale: 0
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Script.default, {
          import: Promise.resolve().then(() => _interopRequireWildcard(require('./scripts/MovementScript')))
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.default, {
          color: _Color.Color.red,
          children: "IM MOVING"
        })]
      })]
    })
  });
}