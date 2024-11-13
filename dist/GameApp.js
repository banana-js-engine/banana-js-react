"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = GameApp;
var _Game = require("./components/Game");
var _GameObject = require("./components/GameObject");
var _OrthographicCamera = require("./components/OrthographicCamera");
var _Scene = require("./components/Scene");
var _Sprite = require("./components/Sprite");
var _Circle = require("./components/Circle");
var _Transform = require("./components/Transform");
var _Script = require("./components/Script");
var _Text = require("./components/Text");
var _BoxBody2D = require("./components/BoxBody2D");
var _CircleBody2D = require("./components/CircleBody2D");
var _Color = require("./renderer/Color");
var _react = require("react");
var _Cube = require("./components/Cube");
var _Mesh = require("./components/Mesh");
var _Light = require("./components/Light");
var _UIText = require("./components/UIText");
var _Particle = require("./components/Particle");
var _Types = require("./core/Types");
var _Cursor = require("./components/Cursor");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function GameApp() {
  const [count, setCount] = (0, _react.useState)(0);
  const incrementCount = () => {
    setCount(prevCount => prevCount + 1);
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Game.Game, {
    name: "Development",
    width: 600,
    height: 600,
    platform: _Types.PlatformType.Web,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Cursor.Cursor, {}), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Scene.Scene, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_GameObject.GameObject, {
        name: "Camera",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Transform.Transform, {
          position: [0, 0, 0]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_OrthographicCamera.OrthographicCamera, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Script.Script, {
          import: Promise.resolve().then(() => _interopRequireWildcard(require('./scripts/OrthographicCameraController')))
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_GameObject.GameObject, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Transform.Transform, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Sprite.Sprite, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_BoxBody2D.BoxBody2D, {
          isStatic: false,
          gravityScale: 0
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Script.Script, {
          import: Promise.resolve().then(() => _interopRequireWildcard(require('./scripts/MovementScript'))),
          speed: 0.1,
          test: incrementCount
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_GameObject.GameObject, {
        name: "Particle",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Transform.Transform, {
          position: [0, 0, 0]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Light.Light, {
          color: _Color.Color.red
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Particle.Particle, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Script.Script, {
          import: Promise.resolve().then(() => _interopRequireWildcard(require('./scripts/ParticleScript')))
        })]
      })]
    })]
  });
}