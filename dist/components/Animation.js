"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Animation;
var _Animator = require("./Animator");
var _Game = require("./Game");
var _AnimationClip = require("../renderer/AnimationClip");
/**
 * 
 * @param {{ src: string, name: string, frames: number, firstFrame: number, length: number, cellWidth: number, cellHeight: number }} props 
 */
function Animation(props) {
  const animator = (0, _Animator.useAnimator)();
  const gl = (0, _Game.useGL)();
  const animation = new _AnimationClip.AnimationClip(gl, props.src, props.name, props.frames, props.firstFrame, props.length, props.cellWidth, props.cellHeight);
  animator.addAnimation(animation);
}