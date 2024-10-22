"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = GameObject;
exports.useGameObject = useGameObject;
var _react = require("react");
var _Scene = require("./Scene");
var _ECS = require("../ecs/ECS");
var _Component = require("../ecs/Component");
const GameObjectContext = /*#__PURE__*/(0, _react.createContext)(null);
function useGameObject() {
  return (0, _react.useContext)(GameObjectContext);
}

/**
 * @param {{ name: string }} props 
 */
function GameObject(props) {
  const gameObjectRef = (0, _react.useRef)();

  /**
   * @type {ECS} entity-component system
   */
  const ecs = (0, _Scene.useScene)();
  gameObjectRef.current = ecs.create();
  ecs.emplace(gameObjectRef.current, new _Component.NameComponent(gameObjectRef.current, ecs, props.name));
  return /*#__PURE__*/React.createElement(GameObjectContext.Provider, {
    value: gameObjectRef.current
  }, props.children);
}