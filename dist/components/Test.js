"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Test = Test;
var _react = require("react");
var _Game = require("./Game");
function Test() {
  /**
   * @type {WebGL2RenderingContext} the WebGL context
   */
  const gl = (0, _Game.useGL)();
  (0, _react.useEffect)(() => {
    gl.clearColor(1, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }, [gl]);
  return null;
}