"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readFileAsText = readFileAsText;
async function readFileAsText(src) {
  try {
    const response = await fetch(src);
    if (!response.ok) throw new Error(`Failed to fetch ${src}: ${response.statusText}`);
    return await response.text();
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    return "";
  }
}