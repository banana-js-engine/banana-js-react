"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnimationClip = void 0;
var _SpriteSheet = require("./SpriteSheet");
var _Texture = require("./Texture");
class AnimationClip {
  #spriteSheet;
  #animationName;
  #frames;
  #firstFrame;
  #length;
  #keyframe;
  #playing;
  #elapsedTime;
  #currentFrame;
  constructor(gl, spriteSheetSrc, animationName, frames, firstFrame, length, cellWidth, cellHeight) {
    this.#spriteSheet = new _SpriteSheet.SpriteSheet(new _Texture.Texture(gl, spriteSheetSrc), cellWidth, cellHeight);
    this.#animationName = animationName;
    this.#frames = frames;
    this.#firstFrame = firstFrame;
    this.#length = length;
    this.#firstFrame = firstFrame;
    this.#keyframe = this.#firstFrame;
  }
  get texture() {
    return this.#spriteSheet.texture;
  }
  get name() {
    return this.#animationName;
  }
  get playing() {
    return this.#playing;
  }
  get currentFrame() {
    return this.#currentFrame;
  }
  play() {
    this.#playing = true;
    this.#currentFrame = this.#spriteSheet.getTexCoords(Math.floor(this.#firstFrame / this.#spriteSheet.maxColumn), this.#firstFrame % this.#spriteSheet.maxColumn);
  }
  stop() {
    this.#playing = false;
    this.#keyframe = this.#firstFrame;
    this.#elapsedTime = 0;
  }
  step(dt) {
    if (!this.#playing) {
      return false;
    }
    this.#elapsedTime += dt;
    if (this.#elapsedTime <= this.#length / this.#frames) {
      return false;
    }
    this.#elapsedTime = 0;
    this.#keyframe++;
    if (this.#keyframe >= this.#firstFrame + this.#frames) {
      this.#keyframe = this.#firstFrame;
    }
    this.#currentFrame = this.#spriteSheet.getTexCoords(Math.floor(this.#keyframe / this.#spriteSheet.maxColumn), this.#keyframe % this.#spriteSheet.maxColumn);
    return true;
  }
}
exports.AnimationClip = AnimationClip;