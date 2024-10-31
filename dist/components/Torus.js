"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Torus;
var _Mesh = _interopRequireDefault(require("./Mesh"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function Torus(props) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Mesh.default, {
    objSrc: "defaultModels/Torus.obj",
    mtlSrc: "defaultModels/Torus.mtl"
  });
}