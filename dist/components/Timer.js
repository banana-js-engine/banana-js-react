"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Timer = Timer;
var _Types = require("../core/Types");
var _Component = require("../ecs/Component");
var _GameObject = require("./GameObject");
/**
 * 
 * @param {{ duration: number, oneShot: boolean, onTimerEnd: Function }} props 
 */
function Timer(props) {
  const gameObject = (0, _GameObject.useGameObject)();
  if (!gameObject.hasComponent(_Types.ComponentType.Timer)) {
    gameObject.addComponent(new _Component.TimerComponent(gameObject, props.duration, props.oneShot, props.onTimerEnd));
  }
}