"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Script;
var _react = require("react");
var _Scene = require("./Scene");
var _GameObject = require("./GameObject");
var _Component = require("../ecs/Component");
/**
 * 
 * @param {{ import: Promise }} props 
 * @returns 
 */
function Script(props) {
  /**
   * @type {ECS} entity-component system
   */
  const ecs = (0, _Scene.useScene)();
  const gameObjectId = (0, _GameObject.useGameObject)();
  (0, _react.useEffect)(() => {
    if (props.import) {
      props.import.then(module => {
        const scriptComponent = Object.values(module)[0];
        ecs.emplace(gameObjectId, new scriptComponent(gameObjectId, ecs));
      }).catch(e => {
        console.log(e);
      });
    }
    if (props.children) {
      let script = `return ${props.children.replace(/\n/g, '')}`;
      const functions = new Function(script);
      const scriptComponent = new _Component.ScriptComponent(gameObjectId, ecs);
      scriptComponent.ready = () => {
        functions()();
      };
      ecs.emplace(gameObjectId, scriptComponent);
    }
  }, []);
  return null;
}