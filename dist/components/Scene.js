"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scene = Scene;
exports.useScene = useScene;
var _react = _interopRequireWildcard(require("react"));
var _ECS = require("../ecs/ECS");
var _SceneManager = require("../ecs/SceneManager");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// gl context
const SceneContext = /*#__PURE__*/(0, _react.createContext)(null);
function useScene() {
  return (0, _react.useContext)(SceneContext);
}

/**
 * 
 * @param props 
 * @returns 
 */
function Scene(props) {
  const ecsRef = (0, _react.useRef)();
  ecsRef.current = new _ECS.ECS();
  _SceneManager.SceneManager.addScene(ecsRef.current);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(SceneContext.Provider, {
    value: ecsRef.current,
    children: ecsRef.current && props.children
  });
}