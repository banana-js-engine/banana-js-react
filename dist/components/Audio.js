"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Audio = Audio;
var _GameObject = require("./GameObject");
var _Component = require("../ecs/Component");
var _Game = require("./Game");
var _Types = require("../core/Types");
/**
 * 
 * @param {{ src: string, volume: number, playOnStart: boolean, loop: boolean }} props 
 */
function Audio(props) {
  const gameObject = (0, _GameObject.useGameObject)();

  /**
   * @type {AudioContext}
   */
  const audioContext = (0, _Game.useAudioContext)();
  if (!gameObject.hasComponent(_Types.ComponentType.Audio)) {
    fetch(props.src).then(response => response.arrayBuffer()).then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)).then(buffer => {
      gameObject.addComponent(new _Component.AudioComponent(gameObject, audioContext, buffer, props.volume, props.playOnStart, props.loop));
    });
  }
}