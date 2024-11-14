"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ShapeType = exports.PlatformType = exports.MouseButtonCode = exports.KeyCode = exports.GamepadButtonCode = exports.ComponentType = void 0;
const PlatformType = exports.PlatformType = {
  Web: 'web',
  Desktop: 'desktop',
  Itchio: 'itchio'
};

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
  Text: 9,
  UIText: 10,
  Light: 11,
  Particle: 12,
  Dialogue: 13,
  Tilemap: 14
};

/**
 * Types of all 2D body shapes
 */
const ShapeType = exports.ShapeType = {
  Box: 0,
  Circle: 1
};

/**
 * Enumarated keyboard key names
 */
const KeyCode = exports.KeyCode = {
  UpArrow: 'arrowup',
  DownArrow: 'arrowdown',
  LeftArrow: 'arrowleft',
  RightArrow: 'arrowright',
  Space: ' ',
  Escape: 'escape',
  Enter: 'enter',
  A: 'a',
  B: 'b',
  C: 'c',
  D: 'd',
  E: 'e',
  F: 'f',
  G: 'g',
  H: 'h',
  I: 'i',
  J: 'j',
  K: 'k',
  L: 'l',
  M: 'm',
  N: 'n',
  O: 'o',
  P: 'p',
  Q: 'q',
  R: 'r',
  S: 's',
  T: 't',
  U: 'u',
  V: 'v',
  W: 'w',
  X: 'x',
  Y: 'y',
  Z: 'z',
  Alpha0: '0',
  Alpha1: '1',
  Alpha2: '2',
  Alpha3: '3',
  Alpha4: '4',
  Alpha5: '5',
  Alpha6: '6',
  Alpha7: '7',
  Alpha8: '8',
  Alpha9: '9'
};
const MouseButtonCode = exports.MouseButtonCode = {
  Left: 0,
  Middle: 1,
  Right: 2
};
const GamepadButtonCode = exports.GamepadButtonCode = {
  A: 0,
  B: 1,
  X: 2,
  Y: 3,
  DpadUp: 12,
  DpadDown: 13,
  DpadLeft: 14,
  DpadRight: 15
};