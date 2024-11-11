"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = App;
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
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function App() {
  const [count, setCount] = (0, _react.useState)(0);
  const incrementCount = () => {
    setCount(prevCount => prevCount + 1);
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Game.Game, {
    name: "Development",
    width: 400,
    height: 400,
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Scene.Scene, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_GameObject.GameObject, {
        name: "Camera",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Transform.Transform, {
          position: [0, 0, 0]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Light.Light, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_OrthographicCamera.OrthographicCamera, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Script.Script, {
          import: Promise.resolve().then(() => _interopRequireWildcard(require('./scripts/OrthographicCameraController')))
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_GameObject.GameObject, {
        name: "Book",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Transform.Transform, {
          position: [0, 0, 0],
          scale: [1, -1, 1]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Mesh.Mesh, {
          objSrc: "TallBuilding01.obj",
          mtlSrc: "TallBuilding01.mtl"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_BoxBody2D.BoxBody2D, {
          isStatic: true,
          gravityScale: 0
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Script.Script, {
          import: Promise.resolve().then(() => _interopRequireWildcard(require('./scripts/RotateScript')))
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_GameObject.GameObject, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Transform.Transform, {
          position: [-4, -4, 0]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
          fontSize: 30,
          color: _Color.Color.white,
          children: "FPS: 60"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Script.Script, {
          import: Promise.resolve().then(() => _interopRequireWildcard(require('./scripts/FPSScript')))
        })]
      })]
    })
  });
}