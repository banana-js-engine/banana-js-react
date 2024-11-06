"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Text = Text;
var _react = require("react");
var _Color = require("../renderer/Color");
var _GameObject = require("./GameObject");
var _Component = require("../ecs/Component");
var _Types = require("../core/Types");
/**
 * 
 * @param {{ color: [number, number, number, number] | Color
 *           fontFamily: string,
 *           fontSize: number }} props 
 */
function Text(props) {
  const gameObject = (0, _GameObject.useGameObject)();
  if (!gameObject.hasComponent(_Types.ComponentType.Text)) {
    const textComponent = new _Component.TextComponent(gameObject, props.children, props.color, props.fontFamily, props.fontSize);
    gameObject.addComponent(textComponent);
  }
  (0, _react.useEffect)(() => {
    gameObject.getComponent(_Types.ComponentType.Text).text = props.children;
  }, [props.children]);
}