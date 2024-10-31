"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ShapeType = exports.ComponentType = void 0;
/**
 * Types of all components
 */
const ComponentType = exports.ComponentType = {
  None: -1,
  Transform: 0,
  Sprite: 1,
  Camera: 2,
  Script: 3,
  Audio: 4,
  Body2D: 5,
  Name: 6,
  Animator: 7,
  Mesh: 8,
  Text: 9
};

/**
 * Types of all 2D body shapes
 */
const ShapeType = exports.ShapeType = {
  Box: 0,
  Circle: 1
};