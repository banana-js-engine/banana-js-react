"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sprite = Sprite;
var _react = require("react");
var _ECS = require("../ecs/ECS");
var _Scene = require("./Scene");
var _GameObject = require("./GameObject");
var _Component = require("../ecs/Component");
var _Types = require("../core/Types");
var _Game = require("./Game");
/**
 * 
 * @param {{ color: [number, number, number, number], src: string 
 *           flipX: boolean, flipY: boolean }} props 
 * @returns 
 */
function Sprite(props) {
  /**
   * @type {ECS} entity-component system
   */
  const ecs = (0, _Scene.useScene)();
  const id = (0, _GameObject.useGameObject)();
  const gl = (0, _Game.useGL)();
  if (!ecs.has(id, _Types.ComponentType.Sprite)) ecs.emplace(id, new _Component.SpriteComponent(id, ecs, gl, props.color, props.src, props.flipX, props.flipY));
}