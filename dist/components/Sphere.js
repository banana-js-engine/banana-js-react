"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sphere = Sphere;
var _Mesh = require("./Mesh");
var _jsxRuntime = require("react/jsx-runtime");
function Sphere(props) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Mesh.Mesh, {
    objSrc: "defaultModels/Sphere.obj",
    mtlSrc: "defaultModels/Sphere.mtl"
  });
}