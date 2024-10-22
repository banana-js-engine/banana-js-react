"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Audio;
var _react = require("react");
var _GameObject = require("./GameObject");
var _Scene = require("./Scene");
var _Component = require("../ecs/Component");
var _Game = require("./Game");
/**
 * 
 * @param {{ src: string, volume: number, playOnStart: boolean, loop: boolean }} props 
 */
function Audio(props) {
  const ecs = (0, _Scene.useScene)();
  const gameObjectId = (0, _GameObject.useGameObject)();

  /**
   * @type {AudioContext}
   */
  const audioContext = (0, _Game.useAudioContext)();
  (0, _react.useEffect)(() => {
    fetch(props.src).then(response => response.arrayBuffer()).then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)).then(buffer => {
      ecs.emplace(gameObjectId, new _Component.AudioComponent(gameObjectId, ecs, audioContext, buffer, props.volume, props.playOnStart, props.loop));
    });
  }, []);
}