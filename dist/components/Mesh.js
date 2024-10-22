"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Mesh;
var _react = require("react");
var _GameObject = require("./GameObject");
var _Scene = require("./Scene");
var _Component = require("../ecs/Component");
/**
 * 
 * @param {{ objSrc: string, mtlSrc: string }} props 
 */
function Mesh(props) {
  const ecs = (0, _Scene.useScene)();
  const id = (0, _GameObject.useGameObject)();
  (0, _react.useEffect)(() => {
    ecs.emplace(id, new _Component.MeshComponent(id, ecs, props.objSrc, props.mtlSrc));
  }, []);
}