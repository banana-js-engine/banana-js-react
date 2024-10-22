"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Cursor;
var _react = require("react");
var _Game = require("./Game");
/**
 * 
 * @param {{ src: string }} props 
* @returns 
*/
function Cursor(props) {
  const canvas = (0, _Game.useCanvas)();
  (0, _react.useEffect)(() => {
    if (!props.src) {
      return;
    }
    canvas.style.cursor = `url(${props.src}), auto`;
  }, []);
}