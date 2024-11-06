"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Animator = Animator;
exports.useAnimator = useAnimator;
var _react = require("react");
var _GameObject = require("./GameObject");
var _Component = require("../ecs/Component");
var _Types = require("../core/Types");
var _jsxRuntime = require("react/jsx-runtime");
const AnimatorContext = /*#__PURE__*/(0, _react.createContext)(null);
function useAnimator() {
  return (0, _react.useContext)(AnimatorContext);
}

/**
 * 
 * @param {{ startAnim: string }} props 
 */
function Animator(props) {
  const animatorRef = (0, _react.useRef)();
  const gameObject = (0, _GameObject.useGameObject)();
  if (!gameObject.hasComponent(_Types.ComponentType.Animator)) {
    animatorRef.current = new _Component.AnimatorComponent(gameObject, props.startAnim);
    gameObject.addComponent(animatorRef.current);
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(AnimatorContext.Provider, {
    value: animatorRef.current,
    children: animatorRef.current && props.children
  });
}