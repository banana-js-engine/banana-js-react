"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Script;
var _react = require("react");
var _Scene = require("./Scene");
var _GameObject = require("./GameObject");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * 
 * @param {{ src: string }} props 
 * @returns 
 */
function Script(props) {
  /**
   * @type {ECS} entity-component system
   */
  const ecs = (0, _Scene.useScene)();
  const gameObjectId = (0, _GameObject.useGameObject)();
  (0, _react.useEffect)(() => {
    if (props.src) {
      (specifier => new Promise(r => r(specifier)).then(s => _interopRequireWildcard(require(s))))(`../scripts/${props.src}`).then(module => {
        const scriptComponent = Object.values(module)[0];
        ecs.emplace(gameObjectId, new scriptComponent(gameObjectId, ecs));
      }).catch(e => {
        console.log(e);
      });
    }
    if (props.children) {
      // eval(props.children);
      new Function(props.children)();
    }
  }, []);
  return null;
}