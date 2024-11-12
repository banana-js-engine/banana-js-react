"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UIText = UIText;
var _react = require("react");
var _Color = require("../renderer/Color");
var _GameObject = require("./GameObject");
var _Component = require("../ecs/Component");
var _Types = require("../core/Types");
/**
 * 
 * @param {{ color: [number, number, number, number] | Color
 *           fontFamily: string,
 *           fontSize: number,
 *           x: number,
 *           y: number }} props 
 */
function UIText(props) {
  const gameObject = (0, _GameObject.useGameObject)();
  if (!gameObject.hasComponent(_Types.ComponentType.Text)) {
    const textComponent = new _Component.UITextComponent(gameObject, props.children, props.color, props.fontFamily, props.fontSize, props.x, props.y);
    gameObject.addComponent(textComponent);
  }
  (0, _react.useEffect)(() => {
    gameObject.getComponent(_Types.ComponentType.UIText).text = props.children;
  }, [props.children]);
}