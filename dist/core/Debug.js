"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Debug = void 0;
var _ECS = require("../ecs/ECS");
var _Types = require("./Types");
class Debug {
  static showCollisionShapes = false;

  /**
   * take a snapshot of the given scene.
   * @param {ECS} scene
   * @returns {string} snapshot data 
   */
  static snapshot(scene) {
    let snapshotData = '';
    const gameObjects = scene.getAllEntities();
    for (const gameObject of gameObjects) {
      const nameComponent = scene.get(gameObject, _Types.ComponentType.Name);
      snapshotData += `${nameComponent.name}\n`;
    }
    return snapshotData;
  }
}
exports.Debug = Debug;