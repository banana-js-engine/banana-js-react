"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Dialogue = Dialogue;
var _Types = require("../core/Types");
var _Component = require("../ecs/Component");
var _GameObject = require("./GameObject");
/**
 * 
 * @param {{ rollDuration, color, fontFamily: string, fontSize, skipKey, playOnStart: boolean }} props 
 */
function Dialogue(props) {
  const gameObject = (0, _GameObject.useGameObject)();
  const dialogue = [];
  for (const child of props.children) {
    dialogue.push(child.props.children);
  }
  if (!gameObject.hasComponent(_Types.ComponentType.Dialogue)) {
    gameObject.addComponent(new _Component.DialogueComponent(gameObject, dialogue, props.rollDuration, props.color, props.fontFamily, props.fontSize, props.skipKey, props.playOnStart));
  }
}