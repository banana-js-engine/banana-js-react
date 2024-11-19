"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = GameApp;
var _Game = require("./components/Game");
var _GameObject = require("./components/GameObject");
var _OrthographicCamera = require("./components/OrthographicCamera");
var _Scene = require("./components/Scene");
var _Sprite = require("./components/Sprite");
var _Circle = require("./components/Circle");
var _Transform = require("./components/Transform");
var _Script = require("./components/Script");
var _Text = require("./components/Text");
var _BoxBody2D = require("./components/BoxBody2D");
var _CircleBody2D = require("./components/CircleBody2D");
var _Color = require("./renderer/Color");
var _react = require("react");
var _Cube = require("./components/Cube");
var _Mesh = require("./components/Mesh");
var _Light = require("./components/Light");
var _UIText = require("./components/UIText");
var _Particle = require("./components/Particle");
var _Types = require("./core/Types");
var _Cursor = require("./components/Cursor");
var _Tilemap = require("./components/Tilemap");
var _Animator = require("./components/Animator");
var _Animation = require("./components/Animation");
var _Dialogue = require("./components/Dialogue");
var _DebugSettings = require("./components/DebugSettings");
var _Audio = require("./components/Audio");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function GameApp() {
  const [count, setCount] = (0, _react.useState)(0);
  const incrementCount = () => {
    setCount(prevCount => prevCount + 1);
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Game.Game, {
    name: "Development",
    width: 400,
    height: 400,
    platform: _Types.PlatformType.Web,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Cursor.Cursor, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_DebugSettings.DebugSettings, {
      showFps: true
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Scene.Scene, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_GameObject.GameObject, {
        name: "Camera",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Transform.Transform, {
          position: [0, 0, 0]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_OrthographicCamera.OrthographicCamera, {
          bgColor: [0, 0, 0, 1]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Script.Script, {
          import: Promise.resolve().then(() => _interopRequireWildcard(require('./scripts/OrthographicCameraController')))
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_GameObject.GameObject, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Transform.Transform, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Audio.Audio, {
          src: "Track01.wav",
          playOnStart: true
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_GameObject.GameObject, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Transform.Transform, {
          position: [-4, -4, 0]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tilemap.Tilemap, {
          src: "dungeon.png",
          dataSrc: "tilemap.data",
          cellWidth: 13,
          cellHeight: 13
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_GameObject.GameObject, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Transform.Transform, {
          position: [0, 0, 1]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Sprite.Sprite, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Animator.Animator, {
          startAnim: "Idle",
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Animation.Animation, {
            src: "dungeon.png",
            name: "Idle",
            firstFrame: 27,
            frames: 0,
            cellWidth: 13,
            cellHeight: 13
          })
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Script.Script, {
          import: Promise.resolve().then(() => _interopRequireWildcard(require('./scripts/MovementScript'))),
          speed: 0.1,
          test: incrementCount
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_GameObject.GameObject, {
        name: "Particle",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Transform.Transform, {
          position: [2.1, -1.3, 2]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Particle.Particle, {
          color: _Color.Color.red,
          count: 10,
          minAge: 0.3,
          maxAge: 0.5
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_GameObject.GameObject, {
        name: "Light",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Transform.Transform, {
          position: [2.1, -1.3, 0]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Light.Light, {
          intensity: 4
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_GameObject.GameObject, {
        name: "Particle",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Transform.Transform, {
          position: [-1.9, 1.8, 2]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Particle.Particle, {
          color: _Color.Color.red,
          count: 10,
          minAge: 0.3,
          maxAge: 0.5
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_GameObject.GameObject, {
        name: "Light",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Transform.Transform, {
          position: [-1.9, 1.8, 0]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Light.Light, {
          intensity: 4
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_GameObject.GameObject, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Transform.Transform, {
          position: [0, 4, 0]
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Dialogue.Dialogue, {
          color: [1, 1, 1, 1],
          fontSize: 20,
          playOnStart: true,
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
            children: "Got the dialogue system working"
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
            children: "So cool!!!"
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
            children: "Better than Bora's"
          })]
        })]
      })]
    })]
  });
}