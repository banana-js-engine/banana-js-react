"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Audio = Audio;
var _react = require("react");
var _GameObject = require("./GameObject");
var _Scene = require("./Scene");
var _Component = require("../ecs/Component");
var _Game = require("./Game");
var _Types = require("../core/Types");
/**
 * 
 * @param {{ src: string, volume: number, playOnStart: boolean, loop: boolean }} props 
 */
function Audio(props) {
  const ecs = (0, _Scene.useScene)();
  const id = (0, _GameObject.useGameObject)();
  const gl = (0, _Game.useGL)();

  /**
   * @type {AudioContext}
   */
  const audioContext = (0, _Game.useAudioContext)();
  if (!ecs.has(id, _Types.ComponentType.Audio)) {
    fetch(props.src).then(response => response.arrayBuffer()).then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)).then(buffer => {
      ecs.emplace(id, new _Component.AudioComponent(id, ecs, gl, audioContext, buffer, props.volume, props.playOnStart, props.loop));
    });
  }
}