"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Engine = void 0;
var _Types = require("./Types");
var _BananaMath = require("../math/BananaMath");
var _Input = require("./Input");
var _World2D = require("../physics/World2D");
var _Debug = require("./Debug");
var _SceneManager = require("../ecs/SceneManager");
var _Color = require("../renderer/Color");
var _Vector = require("../math/Vector");
var _Renderer = require("../renderer/Renderer");
var _TextRenderer = require("../renderer/TextRenderer");
/**
 * The class that controls the game-loop
 */
class Engine {
  #running;
  #previousFrameTime;
  #renderer;
  #textRenderer;
  #world2d;
  #firstUpdate;
  #iteration;

  /*
   *  Flags for warnings to be logged once in the loop
  */
  #zeroCameraFlag;
  #multipleCameraFlag;

  /**
   * 
   * @param {Renderer} renderer 
   * @param {TextRenderer} textRenderer 
   */
  constructor(renderer, textRenderer) {
    this.#running = true;
    this.#previousFrameTime = 0;
    this.#renderer = renderer;
    this.#textRenderer = textRenderer;
    this.#world2d = new _World2D.World2D();
    this.#firstUpdate = true;
    this.#iteration = 0;
    this.#zeroCameraFlag = false;
    this.#multipleCameraFlag = false;
    _Input.Input.init();
    _SceneManager.SceneManager.onSceneChanged = () => {
      this.#world2d.clear();
      this.#firstUpdate = true;
      this.#iteration = 0;
    };
    this.#tick();
  }
  #tick = () => {
    const currentFrameTime = performance.now();
    const deltaTimeMs = currentFrameTime - this.#previousFrameTime;
    let deltaTimeS = deltaTimeMs / 1000;
    this.#previousFrameTime = currentFrameTime;
    deltaTimeS = _BananaMath.BananaMath.clamp(deltaTimeS, 0.01, 0.1);
    if (this.#running) {
      requestAnimationFrame(this.#tick);
    }
    this.#update(deltaTimeS);
  };
  #update(dt) {
    const activeScene = _SceneManager.SceneManager.activeScene;
    if (activeScene) {
      if (this.#iteration < 10) {
        this.#iteration++;
        return;
      }
      if (this.#firstUpdate) {
        this.#firstUpdate = false;
        const goBodies = activeScene.getAll(_Types.ComponentType.Body2D);
        for (let i = 0; i < goBodies.length; i++) {
          this.#world2d.addBody(goBodies[i]);
        }
        const goAnimators = activeScene.getAll(_Types.ComponentType.Animator);
        for (let i = 0; i < goAnimators.length; i++) {
          if (goAnimators[i].startAnim) {
            goAnimators[i].playAnimation(goAnimators[i].startAnim);
          }
        }
        const goScripts = activeScene.getAll(_Types.ComponentType.Script);
        for (let i = 0; i < goScripts.length; i++) {
          goScripts[i].ready();
        }
      }
      const goScripts = activeScene.getAll(_Types.ComponentType.Script);
      for (let i = 0; i < goScripts.length; i++) {
        goScripts[i].step(dt);
      }
      const goCameras = activeScene.getAllWithEntity(_Types.ComponentType.Camera);
      const size = Object.keys(goCameras).length;
      let cameraTransform;
      let cameraComponent;
      if (size === 0 && !this.#zeroCameraFlag) {
        console.warn('there are no cameras in the scene!');
        this.#zeroCameraFlag = true;
      }
      if (size > 1 && !this.#multipleCameraFlag) {
        console.warn('there are more than one camera in the scene!');
        this.#multipleCameraFlag = true;
      }
      if (size === 1) {
        const id = Object.keys(goCameras)[0];
        cameraTransform = activeScene.get(id, _Types.ComponentType.Transform);
        cameraComponent = goCameras[id];
        const cc = cameraComponent.clearColor;
        this.#renderer.setClearColor(cc.x, cc.y, cc.z, cc.w);
      }
      this.#world2d.step(dt);

      // no camera, no rendering
      if (!cameraComponent) {
        return;
      }
      const goAnimators = activeScene.getAll(_Types.ComponentType.Animator);
      for (let i = 0; i < goAnimators.length; i++) {
        goAnimators[i].step(dt);
      }
      this.#renderer.beginScene(cameraTransform, cameraComponent);
      this.#renderer.clear();
      const goSprites = activeScene.getAllWithEntity(_Types.ComponentType.Sprite);
      for (const id in goSprites) {
        const transform = activeScene.get(id, _Types.ComponentType.Transform);
        this.#renderer.drawQuad(transform, goSprites[id]);
      }
      const goMeshes = activeScene.getAllWithEntity(_Types.ComponentType.Mesh);
      for (const id in goMeshes) {
        const transform = activeScene.get(id, _Types.ComponentType.Transform);
        this.#renderer.drawMesh(transform, goMeshes[id]);
      }
      if (_Debug.Debug.showCollisionShapes) {
        const goBodies = activeScene.getAll(_Types.ComponentType.Body2D);
        for (let i = 0; i < goBodies.length; i++) {
          if (goBodies[i].shapeType == _Types.ShapeType.Box) {
            const vertices = goBodies[i].vertices;
            for (let j = 0; j < vertices.length; j++) {
              this.#renderer.drawLine(vertices[j], vertices[(j + 1) % vertices.length], _Color.Color.green);
            }
          }
        }
      }
      if (_Debug.Debug.showContactPoints) {
        for (let i = 0; i < this.#world2d.contactPoints.length; i++) {
          const point = _Vector.Vector3.zero;
          point.set(this.#world2d.contactPoints[i]);
          this.#renderer.drawRect(point, _Vector.Vector2.one.mul(0.2), _Color.Color.orange);
        }
      }
      this.#renderer.endScene();
      this.#textRenderer.clear();
      const goTexts = activeScene.getAll(_Types.ComponentType.Text);
      for (let i = 0; i < goTexts.length; i++) {
        this.#textRenderer.drawText(goTexts[i]);
      }

      // Debug
      if (_Input.Input.getKey('control') && _Input.Input.getKey('alt') && _Input.Input.getKeyDown('s')) {
        console.log(_Debug.Debug.snapshot(activeScene));
      }
    }
    _Input.Input.mouseDelta.set(0, 0);
  }
}
exports.Engine = Engine;