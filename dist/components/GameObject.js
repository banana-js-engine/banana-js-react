"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameObject = GameObject;
exports.useGameObject = useGameObject;
var _react = require("react");
var _Scene = require("./Scene");
var _ECS = require("../ecs/ECS");
var _Component = require("../ecs/Component");
var _jsxRuntime = require("react/jsx-runtime");
const GameObjectContext = /*#__PURE__*/(0, _react.createContext)(null);
function useGameObject() {
  return (0, _react.useContext)(GameObjectContext);
}

/**
 * @param {{ name: string }} props 
 */
function GameObject(props) {
  const gameObjectRef = (0, _react.useRef)();

  // Only initialize once
  if (!gameObjectRef.current) {
    /**
     * @type {ECS} entity-component system
     */
    const ecs = (0, _Scene.useScene)();
    gameObjectRef.current = ecs.create();
    ecs.emplace(gameObjectRef.current, new _Component.NameComponent(gameObjectRef.current, ecs, props.name));
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(GameObjectContext.Provider, {
    value: gameObjectRef.current,
    children: props.children
  });
}