"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cube = Cube;
var _Mesh = require("./Mesh");
var _jsxRuntime = require("react/jsx-runtime");
function Cube(props) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Mesh.Mesh, {
    objSrc: "defaultModels/Cube.obj",
    mtlSrc: "defaultModels/Cube.mtl"
  });
}