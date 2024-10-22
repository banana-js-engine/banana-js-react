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
/**
 * The class that controls the game-loop
 */
class Engine {
  #running;
  #previousFrameTime;
  #rendererRef;
  #world2d;
  #firstUpdate;
  #iteration;

  /*
   *  Flags for warnings to be logged once in the loop
  */
  #zeroCameraFlag;
  #multipleCameraFlag;
  constructor(renderer) {
    this.#running = true;
    this.#previousFrameTime = 0;
    this.#rendererRef = renderer;
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
        this.#rendererRef.setClearColor(cc.x, cc.y, cc.z, cc.w);
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
      this.#rendererRef.beginScene(cameraTransform, cameraComponent);
      this.#rendererRef.clear();
      const goSprites = activeScene.getAllWithEntity(_Types.ComponentType.Sprite);
      for (const id in goSprites) {
        const transform = activeScene.get(id, _Types.ComponentType.Transform);
        this.#rendererRef.drawQuad(transform, goSprites[id]);
      }
      const goMeshes = activeScene.getAllWithEntity(_Types.ComponentType.Mesh);
      for (const id in goMeshes) {
        const transform = activeScene.get(id, _Types.ComponentType.Transform);
        this.#rendererRef.drawMesh(transform, goMeshes[id]);
      }
      if (_Debug.Debug.showCollisionShapes) {
        const goBodies = activeScene.getAll(_Types.ComponentType.Body2D);
        for (let i = 0; i < goBodies.length; i++) {
          if (goBodies[i].shapeType == _Types.ShapeType.Box) {
            const vertices = goBodies[i].vertices;
            for (let j = 0; j < vertices.length; j++) {
              this.#rendererRef.drawLine(vertices[j], vertices[(j + 1) % vertices.length], _Color.Color.green);
            }
          }
        }
      }
      this.#rendererRef.endScene();

      // Debug
      if (_Input.Input.getKey('control') && _Input.Input.getKey('alt') && _Input.Input.getKeyDown('s')) {
        console.log(_Debug.Debug.snapshot(activeScene));
      }
    }
  }
}
exports.Engine = Engine;