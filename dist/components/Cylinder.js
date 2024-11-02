"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cylinder = Cylinder;
var _Mesh = require("./Mesh");
var _jsxRuntime = require("react/jsx-runtime");
function Cylinder(props) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Mesh.Mesh, {
    objSrc: "defaultModels/Cylinder.obj",
    mtlSrc: "defaultModels/Cylinder.mtl"
  });
}