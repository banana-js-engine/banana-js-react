"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = App;
var _Game = _interopRequireDefault(require("./components/Game"));
var _GameObject = _interopRequireDefault(require("./components/GameObject"));
var _OrthographicCamera = _interopRequireDefault(require("./components/OrthographicCamera"));
var _Scene = _interopRequireDefault(require("./components/Scene"));
var _Sprite = _interopRequireDefault(require("./components/Sprite"));
var _Transform = _interopRequireDefault(require("./components/Transform"));
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
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Transform.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_OrthographicCamera.default, {})]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_GameObject.default, {
        name: "Square",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Transform.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Sprite.default, {
          color: [0, 1, 0, 1]
        })]
      })]
    })
  });
}