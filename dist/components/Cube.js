"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Cube;
var _Mesh = _interopRequireDefault(require("./Mesh"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function Cube(props) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Mesh.default, {
    objSrc: "defaultModels/Cube.obj",
    mtlSrc: "defaultModels/Cube.mtl"
  });
}