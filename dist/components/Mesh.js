"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mesh = Mesh;
var _GameObject = require("./GameObject");
var _Component = require("../ecs/Component");
var _Types = require("../core/Types");
/**
 * 
 * @param {{ objSrc: string, mtlSrc: string, color }} props 
 */
function Mesh(props) {
  const gameObject = (0, _GameObject.useGameObject)();
  if (!gameObject.hasComponent(_Types.ComponentType.Mesh)) {
    gameObject.addComponent(new _Component.MeshComponent(gameObject, props.objSrc, props.mtlSrc, props.color));
  }
}