"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Text = Text;
var _react = require("react");
var _Color = require("../renderer/Color");
var _GameObject = require("./GameObject");
var _Scene = require("./Scene");
var _Component = require("../ecs/Component");
var _Types = require("../core/Types");
/**
 * 
 * @param {{ color: [number, number, number, number] | Color
 *           fontFamily: string,
 *           fontSize: number }} props 
 */
function Text(props) {
  const ecs = (0, _Scene.useScene)();
  const id = (0, _GameObject.useGameObject)();
  if (!ecs.has(id, _Types.ComponentType.Text)) {
    const textComponent = new _Component.TextComponent(id, ecs, props.children, props.color, props.fontFamily, props.fontSize);
    ecs.emplace(id, textComponent);
  }
  (0, _react.useEffect)(() => {
    ecs.get(id, _Types.ComponentType.Text).text = props.children;
  }, [props.children]);
}