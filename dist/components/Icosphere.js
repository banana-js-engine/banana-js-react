"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Icosphere = Icosphere;
var _Mesh = require("./Mesh");
var _jsxRuntime = require("react/jsx-runtime");
/**
 * 
 * @param {{ color }} props 
 * @returns 
 */
function Icosphere(props) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Mesh.Mesh, {
    objSrc: "defaultModels/Icosphere.obj",
    mtlSrc: "defaultModels/Icosphere.mtl",
    color: props.color
  });
}