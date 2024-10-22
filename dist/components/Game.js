"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Game;
exports.useAudioContext = useAudioContext;
exports.useCanvas = useCanvas;
exports.useEngine = useEngine;
exports.useGL = useGL;
exports.useRenderer = useRenderer;
var _react = _interopRequireWildcard(require("react"));
var _Renderer = require("../renderer/Renderer");
var _Engine = require("../core/Engine");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// canvas context
const CanvasContext = /*#__PURE__*/(0, _react.createContext)(null);
function useCanvas() {
  return (0, _react.useContext)(CanvasContext);
}

// gl context
const GLContext = /*#__PURE__*/(0, _react.createContext)(null);
function useGL() {
  return (0, _react.useContext)(GLContext);
}

// renderer context
const RendererContext = /*#__PURE__*/(0, _react.createContext)(null);
function useRenderer() {
  return (0, _react.useContext)(RendererContext);
}

// engine context
const EngineContext = /*#__PURE__*/(0, _react.createContext)(null);
function useEngine() {
  return (0, _react.useContext)(EngineContext);
}

// audio context
const AudioContextContext = /*#__PURE__*/(0, _react.createContext)(null);
function useAudioContext() {
  return (0, _react.useContext)(AudioContextContext);
}
function Game(props) {
  // Refs
  const canvasRef = (0, _react.useRef)();
  const rendererRef = (0, _react.useRef)();
  const engineRef = (0, _react.useRef)();
  const audioRef = (0, _react.useRef)();

  // States
  const [gl, setGL] = (0, _react.useState)(null);
  const [initialized, setInitialized] = (0, _react.useState)(false);
  (0, _react.useEffect)(() => {
    document.title = props.name;

    // set canvas size
    canvasRef.current.width = props.width;
    canvasRef.current.height = props.height;
    canvasRef.current.addEventListener('contextmenu', event => {
      event.preventDefault();
    });
    const context = canvasRef.current.getContext('webgl2', {
      antialias: false
    });
    setGL(context);

    // initialize webgl
    context.viewport(0, 0, props.width, props.height);

    // initialize renderer
    rendererRef.current = new _Renderer.Renderer(context);

    // initialize engine
    engineRef.current = new _Engine.Engine(rendererRef.current);
    audioRef.current = new AudioContext();

    // Set initialized to true
    setInitialized(true);
  }, []);
  return /*#__PURE__*/_react.default.createElement(CanvasContext.Provider, {
    value: canvasRef.current
  }, /*#__PURE__*/_react.default.createElement(EngineContext.Provider, {
    value: engineRef.current
  }, /*#__PURE__*/_react.default.createElement(RendererContext.Provider, {
    value: rendererRef.current
  }, /*#__PURE__*/_react.default.createElement(GLContext.Provider, {
    value: gl
  }, /*#__PURE__*/_react.default.createElement(AudioContextContext.Provider, {
    value: audioRef.current
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      userSelect: 'none',
      position: 'absolute',
      width: '100%',
      height: '100%',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/_react.default.createElement("canvas", {
    id: "banana-canvas",
    ref: canvasRef,
    style: {
      outlineStyle: 'none'
    },
    tabIndex: 1
  }, initialized && props.children)))))));
}