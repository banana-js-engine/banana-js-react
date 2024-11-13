"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cursor = Cursor;
var _react = require("react");
/**
 * 
 * @param {{ src: string }} props 
* @returns 
*/
function Cursor(props) {
  const canvas = document.getElementById('banana-canvas');
  (0, _react.useEffect)(() => {
    if (!props.src) {
      canvas.style.cursor = 'none';
      return;
    }
    canvas.style.cursor = `url(${props.src}), auto`;
  }, []);
}