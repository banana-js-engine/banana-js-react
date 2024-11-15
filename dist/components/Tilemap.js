"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tilemap = Tilemap;
var _Types = require("../core/Types");
var _Component = require("../ecs/Component");
var _file = require("../utils/file");
var _GameObject = require("./GameObject");
/**
 * 
 * @param {{ src: string, dataSrc: string, cellWidth, cellHeight }} props 
 */
function Tilemap(props) {
  const gameObject = (0, _GameObject.useGameObject)();
  if (!gameObject.hasComponent(_Types.ComponentType.Tilemap)) {
    gameObject.addComponent(new _Component.TilemapComponent(gameObject, props.src, props.dataSrc, props.cellWidth, props.cellHeight));
  }
}