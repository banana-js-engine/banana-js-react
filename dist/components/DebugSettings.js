"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DebugSettings = DebugSettings;
var _Debug = require("../core/Debug");
/**
 * 
 * @param {{ showCollisionShapes: boolean, showContactPoints: boolean, showFps: boolean }} props 
 */
function DebugSettings(props) {
  if (typeof props.showCollisionShapes != 'undefined') {
    _Debug.Debug.showCollisionShapes = props.showCollisionShapes;
  }
  if (typeof props.showContactPoints != 'undefined') {
    _Debug.Debug.showContactPoints = props.showContactPoints;
  }
  if (typeof props.showFps != 'undefined') {
    _Debug.Debug.showFps = props.showFps;
  }
}