"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Torus = Torus;
var _Mesh = require("./Mesh");
var _jsxRuntime = require("react/jsx-runtime");
function Torus(props) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Mesh.Mesh, {
    objSrc: "defaultModels/Torus.obj",
    mtlSrc: "defaultModels/Torus.mtl"
  });
}