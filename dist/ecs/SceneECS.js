"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SceneECS = void 0;
var _ECS = require("./ECS");
var _GO = require("./GO");
var _Types = require("../core/Types");
var _Component = require("./Component");
var _react = _interopRequireDefault(require("react"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class SceneECS {
  #ecs;
  prefabs;

  /**
   * 
   * @param {ECS} ecs 
   */
  constructor(ecs) {
    this.#ecs = ecs;
    this.prefabs = [];
  }
  createPrefab(prefab) {
    const len = this.prefabs.length;
    this.prefabs.push(/*#__PURE__*/(0, _jsxRuntime.jsx)(_react.default.Fragment, {
      children: prefab
    }, len));
    this.onPrefabCreated();
  }
  createGameObject() {
    return this.#ecs.create();
  }

  /**
   * @param {GO} gameObject 
   */
  destroyGameObject(gameObject) {
    this.#ecs.release(gameObject.handle);
  }
  addComponent(handle, component) {
    return this.#ecs.emplace(handle, component);
  }
  addEmptyComponent(go, type) {
    if (type == _Types.ComponentType.Body2D) {
      return this.#ecs.emplace(go.handle, _Component.ComponentMap[type](go));
    }
    return this.#ecs.emplace(go.handle, new _Component.ComponentMap[type](go));
  }
  getComponent(handle, type) {
    return this.#ecs.get(handle, type);
  }
  getComponents(type) {
    return this.#ecs.getAll(type);
  }
  hasComponent(handle, type) {
    return this.#ecs.has(handle, type);
  }
  getComponentsWithIds(type) {
    return this.#ecs.getAllWithEntity(type);
  }
  groupComponents() {
    for (var _len = arguments.length, types = new Array(_len), _key = 0; _key < _len; _key++) {
      types[_key] = arguments[_key];
    }
    return this.#ecs.group(types);
  }
}
exports.SceneECS = SceneECS;