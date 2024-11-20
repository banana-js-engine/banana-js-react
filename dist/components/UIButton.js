"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UIButton = UIButton;
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
 *           y: number,
 *           width: number,
 *           height: number,
 *           onClick: Function }} props 
 */
function UIButton(props) {
  const gameObject = (0, _GameObject.useGameObject)();
  if (!gameObject.hasComponent(_Types.ComponentType.UIButton)) {
    const buttonComponent = new _Component.UIButtonComponent(gameObject, props.x, props.y, props.children, props.color, props.fontFamily, props.fontSize, props.width, props.height, props.onClick);
    gameObject.addComponent(buttonComponent);
  }
  (0, _react.useEffect)(() => {
    gameObject.getComponent(_Types.ComponentType.UIButton).text = props.children;
  }, [props.children]);
}