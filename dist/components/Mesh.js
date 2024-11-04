"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mesh = Mesh;
var _react = require("react");
var _GameObject = require("./GameObject");
var _Scene = require("./Scene");
var _Component = require("../ecs/Component");
var _Types = require("../core/Types");
/**
 * 
 * @param {{ objSrc: string, mtlSrc: string }} props 
 */
function Mesh(props) {
  const ecs = (0, _Scene.useScene)();
  const id = (0, _GameObject.useGameObject)();
  if (!ecs.has(id, _Types.ComponentType.Mesh)) {
    ecs.emplace(id, new _Component.MeshComponent(id, ecs, props.objSrc, props.mtlSrc));
  }
}