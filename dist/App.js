"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = App;
var _GameApp = _interopRequireDefault(require("./GameApp"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function App() {
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    style: {
      maxWidth: 'fit-content',
      margin: 'auto'
    },
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("h1", {
        style: {
          textAlign: 'center'
        },
        children: "BANANA.JS PLAYGROUND"
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_GameApp.default, {})]
  });
}