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
/**
 * 
 * @param {{ color: [number, number, number, number] | Color
 *           fontFamily: string,
 *           fontSize: number }} props 
 */
function Text(props) {
  const ecs = (0, _Scene.useScene)();
  const id = (0, _GameObject.useGameObject)();
  (0, _react.useEffect)(() => {
    ecs.emplace(id, new _Component.TextComponent(id, ecs, props.children, props.color, props.fontFamily, props.fontSize));
  });
}