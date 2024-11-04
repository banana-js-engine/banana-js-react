"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Game = Game;
exports.useAudioContext = useAudioContext;
exports.useEngine = useEngine;
exports.useGL = useGL;
var _react = _interopRequireWildcard(require("react"));
var _Renderer = require("../renderer/Renderer");
var _Engine = require("../core/Engine");
var _TextRenderer = require("../renderer/TextRenderer");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// gl context
const GLContext = /*#__PURE__*/(0, _react.createContext)(null);
function useGL() {
  return (0, _react.useContext)(GLContext);
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
  const engineRef = (0, _react.useRef)();
  const audioRef = (0, _react.useRef)();

  // States
  const [gl, setGL] = (0, _react.useState)(null);
  const [initialized, setInitialized] = (0, _react.useState)(false);
  (0, _react.useEffect)(() => {
    document.title = props.name;

    // set canvas size
    const canvas = document.getElementById('banana-canvas');
    canvas.width = props.width;
    canvas.height = props.height;
    canvas.addEventListener('contextmenu', event => {
      event.preventDefault();
    });
    const context = canvas.getContext('webgl2', {
      antialias: false
    });
    setGL(context);

    // initialize webgl
    context.viewport(0, 0, props.width, props.height);

    // 2d context
    const textCanvas = document.getElementById('banana-text');
    textCanvas.width = props.width;
    textCanvas.height = props.height;
    textCanvas.addEventListener('contextmenu', event => {
      event.preventDefault();
    });
    const ctx = textCanvas.getContext('2d');

    // initialize renderer(s)
    const renderer = new _Renderer.Renderer(context);
    const textRenderer = new _TextRenderer.TextRenderer(ctx);

    // initialize engine
    engineRef.current = new _Engine.Engine(renderer, textRenderer);
    audioRef.current = new AudioContext();

    // Set initialized to true
    setInitialized(true);
  }, []);
  const onClick = function () {
    document.getElementById('banana-canvas').focus();
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(EngineContext.Provider, {
    value: engineRef.current,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(GLContext.Provider, {
      value: gl,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(AudioContextContext.Provider, {
        value: audioRef.current,
        children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: props.width,
            height: props.height
          },
          onClick: onClick,
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("canvas", {
            id: "banana-text",
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              outlineStyle: 'none'
            },
            tabIndex: -1
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("canvas", {
            id: "banana-canvas",
            style: {
              userSelect: 'none',
              WebkitUserSelect: 'none',
              outlineStyle: 'none'
            },
            tabIndex: 1,
            children: initialized && props.children
          })]
        })
      })
    })
  });
}