"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sprite = Sprite;
var _GameObject = require("./GameObject");
var _Component = require("../ecs/Component");
var _Types = require("../core/Types");
/**
 * 
 * @param {{ color: [number, number, number, number], src: string 
 *           flipX: boolean, flipY: boolean }} props 
 * @returns 
 */
function Sprite(props) {
  const gameObject = (0, _GameObject.useGameObject)();
  if (!gameObject.hasComponent(_Types.ComponentType.Sprite)) gameObject.addComponent(new _Component.SpriteComponent(gameObject, props.color, props.src, props.flipX, props.flipY));
}