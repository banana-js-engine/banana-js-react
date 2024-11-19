"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameObject = GameObject;
exports.useGameObject = useGameObject;
var _react = require("react");
var _Scene = require("./Scene");
var _GO = require("../ecs/GO");
var _Game = require("./Game");
var _Component = require("../ecs/Component");
var _SceneECS = require("../ecs/SceneECS");
var _jsxRuntime = require("react/jsx-runtime");
const GameObjectContext = /*#__PURE__*/(0, _react.createContext)(null);

/**
 * @returns {GO}
 */
function useGameObject() {
  return (0, _react.useContext)(GameObjectContext);
}

/**
 * @param {{ name: string, active: boolean }} props 
 */
function GameObject(props) {
  const gameObjectRef = (0, _react.useRef)();
  const parent = useGameObject();

  // Only initialize once
  if (!gameObjectRef.current) {
    /**
     * @type {SceneECS} entity-component system
     */
    const scene = (0, _Scene.useScene)();
    const handle = scene.createGameObject();
    const gl = (0, _Game.useGL)();
    gameObjectRef.current = new _GO.GO(scene, handle, gl, props.active, parent);
    gameObjectRef.current.addComponent(new _Component.NameComponent(gameObjectRef.current, props.name));
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(GameObjectContext.Provider, {
    value: gameObjectRef.current,
    children: props.children
  });
}