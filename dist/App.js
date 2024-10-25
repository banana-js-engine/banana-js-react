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
var _PerspectiveCamera = _interopRequireDefault(require("./components/PerspectiveCamera"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
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
          src: "OrthographicCameraController.js"
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_GameObject.default, {
        name: "Square",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Transform.default, {
          position: [0, 3, 0],
          scale: [5, -5, 5]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Mesh.default, {
          objSrc: "book.obj"
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_GameObject.default, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Transform.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Sprite.default, {
          src: "defaultShapes/circle.png"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Animator.default, {
          startAnim: "DinoIdle",
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Animation.default, {
            name: "DinoIdle",
            src: "Dino.png",
            firstFrame: 0,
            frames: 4,
            length: 0.5,
            cellWidth: 24,
            cellHeight: 24
          })
        })]
      })]
    })
  });
}