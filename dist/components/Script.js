"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Script = Script;
var _GameObject = require("./GameObject");
var _Component = require("../ecs/Component");
var _Types = require("../core/Types");
/**
 * 
 * @param {{ import: Promise }} props 
 * @returns 
 */
function Script(props) {
  const gameObject = (0, _GameObject.useGameObject)();
  const properties = Object.entries(props).filter(_ref => {
    let [key, value] = _ref;
    return value;
  });
  if (!gameObject.hasComponent(_Types.ComponentType.Script)) {
    if (props.import) {
      props.import.then(module => {
        const scriptComponent = Object.values(module)[0];
        const scriptComponentIns = new scriptComponent(gameObject);
        for (let i = 0; i < properties.length; i++) {
          scriptComponentIns[properties[i][0]] = properties[i][1];
        }
        gameObject.addComponent(scriptComponentIns);
      }).catch(e => {
        console.log(e);
      });
    }
    if (props.children) {
      let script = `return ${props.children.replace(/\n/g, '')}`;
      const functions = new Function(script);
      const scriptComponent = new _Component.ScriptComponent(gameObject);
      scriptComponent.ready = () => {
        functions()();
      };
      gameObject.addComponent(scriptComponent);
    }
  }
}