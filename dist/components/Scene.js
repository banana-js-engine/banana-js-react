"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scene = Scene;
exports.useScene = useScene;
var _react = _interopRequireWildcard(require("react"));
var _ECS = require("../ecs/ECS");
var _SceneManager = require("../ecs/SceneManager");
var _SceneECS = require("../ecs/SceneECS");
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
  const [prefabs, setPrefabs] = (0, _react.useState)([]);
  const sceneRef = (0, _react.useRef)();
  if (!sceneRef.current) {
    sceneRef.current = new _SceneECS.SceneECS(new _ECS.ECS());
    sceneRef.current.onPrefabCreated = () => {
      setPrefabs(sceneRef.current.prefabs);
      console.log(sceneRef.current.prefabs);
    };
    _SceneManager.SceneManager.addScene(sceneRef.current);
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(SceneContext.Provider, {
    value: sceneRef.current,
    children: [sceneRef.current && props.children, sceneRef.current && prefabs]
  });
}