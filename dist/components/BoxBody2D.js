"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BoxBody2D = BoxBody2D;
var _react = require("react");
var _GameObject = require("./GameObject");
var _Scene = require("./Scene");
var _Component = require("../ecs/Component");
/**
 * 
 * @param {{ isStatic: boolean, gravityScale: number }} props 
 */
function BoxBody2D(props) {
  const ecs = (0, _Scene.useScene)();
  const id = (0, _GameObject.useGameObject)();
  (0, _react.useEffect)(() => {
    ecs.emplace(id, _Component.Body2DComponent.createBoxBody2D(id, ecs, 1, 1, 0.2, props.isStatic, 0.6, props.gravityScale));
  }, []);
}