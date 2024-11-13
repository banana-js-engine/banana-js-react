"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Light = Light;
var _Types = require("../core/Types");
var _Component = require("../ecs/Component");
var _GameObject = require("./GameObject");
/**
 * 
 * @param {{ color }} props 
 */
function Light(props) {
  const gameObject = (0, _GameObject.useGameObject)();
  if (!gameObject.hasComponent(_Types.ComponentType.Light)) {
    gameObject.addComponent(new _Component.LightComponent(gameObject, props.color));
  }
}