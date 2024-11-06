"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Script = Script;
var _react = require("react");
var _Scene = require("./Scene");
var _GameObject = require("./GameObject");
var _Component = require("../ecs/Component");
var _Types = require("../core/Types");
var _Game = require("./Game");
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
  const id = (0, _GameObject.useGameObject)();
  const gl = (0, _Game.useGL)();
  const properties = Object.entries(props).filter(_ref => {
    let [key, value] = _ref;
    return value;
  });
  if (!ecs.has(id, _Types.ComponentType.Script)) {
    if (props.import) {
      props.import.then(module => {
        const scriptComponent = Object.values(module)[0];
        const scriptComponentIns = new scriptComponent(id, ecs, gl);
        for (let i = 0; i < properties.length; i++) {
          scriptComponentIns[properties[i][0]] = properties[i][1];
        }
        ecs.emplace(id, scriptComponentIns);
      }).catch(e => {
        console.log(e);
      });
    }
    if (props.children) {
      let script = `return ${props.children.replace(/\n/g, '')}`;
      const functions = new Function(script);
      const scriptComponent = new _Component.ScriptComponent(id, ecs, gl);
      scriptComponent.ready = () => {
        functions()();
      };
      ecs.emplace(gameObjectId, scriptComponent);
    }
  }
}