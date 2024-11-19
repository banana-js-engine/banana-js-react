"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Engine = void 0;
var _Types = require("./Types");
var _bananaMath = require("../math/bananaMath");
var _Input = require("./Input");
var _World2D = require("../physics/World2D");
var _Debug = require("./Debug");
var _SceneManager = require("../ecs/SceneManager");
var _Color = require("../renderer/Color");
var _Vector = require("../math/Vector");
var _Renderer = require("../renderer/Renderer");
var _TextRenderer = require("../renderer/TextRenderer");
var _Collisions = require("../physics/Collisions");
var _SceneECS = require("../ecs/SceneECS");
var _Matrix = require("../math/Matrix");
/**
 * The class that controls the game-loop
 */
class Engine {
  running;
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
    this.running = false;
    this.#previousFrameTime = 0;
    this.#renderer = renderer;
    this.#textRenderer = textRenderer;
    this.#world2d = new _World2D.World2D();
    this.#firstUpdate = true;
    this.#iteration = 0;
    this.#zeroCameraFlag = false;
    this.#multipleCameraFlag = false;
    _Input.Input.init();
    _Matrix.Matrix4.init();
    _SceneManager.SceneManager.onSceneChanged = () => {
      this.#world2d.clear();
      this.#firstUpdate = true;
      this.#iteration = 0;
    };
    this.#renderer.setClearColor(0, 0, 0, 1);
    this.#renderer.clear();
    this.#tick();
  }
  #tick = timestamp => {
    const deltaTimeS = (0, _bananaMath.clamp)((timestamp - this.#previousFrameTime) / 1000, 0.01, 0.1);
    this.#previousFrameTime = timestamp;
    requestAnimationFrame(this.#tick);
    this.#update(deltaTimeS);
  };
  #update(dt) {
    /**
     * @type {SceneECS} activeScene
     */
    const activeScene = _SceneManager.SceneManager.activeScene;
    if (!activeScene) {
      return;
    }
    if (this.#iteration < 60) {
      this.#iteration++;
      return;
    }
    if (!this.running) {
      return;
    }
    const goAnimators = activeScene.getComponents(_Types.ComponentType.Animator);
    const goParticles = activeScene.getComponents(_Types.ComponentType.Particle);
    if (this.#firstUpdate) {
      for (let i = 0; i < goAnimators.length; i++) {
        if (goAnimators[i].startAnim) {
          goAnimators[i].playAnimation(goAnimators[i].startAnim);
        }
      }
      this.#renderer.particlesInit(goParticles);
    }
    this.#textRenderer.clear();
    const goTexts = activeScene.getComponents(_Types.ComponentType.Text);
    for (let i = 0; i < goTexts.length; i++) {
      if (goTexts[i].active) {
        this.#textRenderer.drawText(goTexts[i]);
      }
    }
    const goUITexts = activeScene.getComponents(_Types.ComponentType.UIText);
    for (let i = 0; i < goUITexts.length; i++) {
      if (goUITexts[i].active) {
        this.#textRenderer.drawUIText(goUITexts[i]);
      }
    }
    const goDialogues = activeScene.getComponents(_Types.ComponentType.Dialogue);
    for (let i = 0; i < goDialogues.length; i++) {
      if (goDialogues[i].active && goDialogues[i].isDialogueRunning) {
        this.#textRenderer.drawDialogue(goDialogues[i], dt);
      }
    }
    const goScripts = activeScene.getComponents(_Types.ComponentType.Script);
    for (let i = 0; i < goScripts.length; i++) {
      if (goScripts[i].active) {
        if (!goScripts[i].readyCalled) {
          goScripts[i].readyCalled = true;
          goScripts[i].ready();
        }
        goScripts[i].step(dt);
      }
    }
    const goTimers = activeScene.getComponents(_Types.ComponentType.Timer);
    for (let i = 0; i < goTimers.length; i++) {
      if (goTimers[i].active) {
        goTimers[i].step(dt);
      }
    }
    this.#world2d.clear();
    const goBodies = activeScene.getComponents(_Types.ComponentType.Body2D);
    for (let i = 0; i < goBodies.length; i++) {
      if (goBodies[i].active) {
        this.#world2d.addBody(goBodies[i]);
      }
    }
    const goCameras = activeScene.getComponentsWithIds(_Types.ComponentType.Camera);
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
      cameraTransform = goCameras[id].getComponent(_Types.ComponentType.Transform);
      cameraComponent = goCameras[id];
      const cc = cameraComponent.clearColor;
      this.#renderer.setClearColor(cc.x, cc.y, cc.z, cc.w);
    }
    this.#world2d.step(dt);
    const scriptBodyGroup = activeScene.groupComponents(_Types.ComponentType.Script, _Types.ComponentType.Body2D);
    for (let i = 0; i < scriptBodyGroup.length; i++) {
      if (this.#firstUpdate) {
        if (_Collisions.Collisions.checkAABBCollision(scriptBodyGroup[i][1].AABB, cameraComponent.AABB)) {
          scriptBodyGroup[i][0].outOfViewport = false;
        } else {
          scriptBodyGroup[i][0].outOfViewport = true;
        }
      } else {
        if (!scriptBodyGroup[i][0].active) {
          continue;
        }
        if (_Collisions.Collisions.checkAABBCollision(scriptBodyGroup[i][1].AABB, cameraComponent.AABB) && scriptBodyGroup[i][0].outOfViewport) {
          scriptBodyGroup[i][0].outOfViewport = false;
          scriptBodyGroup[i][0].onEnterViewport();
        } else if (!_Collisions.Collisions.checkAABBCollision(scriptBodyGroup[i][1].AABB, cameraComponent.AABB) && !scriptBodyGroup[i][0].outOfViewport) {
          scriptBodyGroup[i][0].outOfViewport = true;
          scriptBodyGroup[i][0].onExitViewport();
        }
      }
    }

    // no camera, no rendering
    if (!cameraComponent) {
      return;
    }
    const goLights = activeScene.getComponents(_Types.ComponentType.Light);
    const activeLights = [];
    for (let i = 0; i < goLights.length; i++) {
      if (goLights[i].on) {
        activeLights.push(goLights[i]);
      }
    }
    for (let i = 0; i < goAnimators.length; i++) {
      if (goAnimators[i].active) {
        goAnimators[i].step(dt);
      }
    }
    this.#renderer.beginScene(cameraTransform, cameraComponent, activeLights);
    this.#renderer.clear();
    for (let i = 0; i < goParticles.length; i++) {
      if (!goParticles[i].active) {
        continue;
      }
      this.#renderer.drawParticle(goParticles[i], dt);
    }
    const goTilemaps = activeScene.getComponents(_Types.ComponentType.Tilemap);
    for (let i = 0; i < goTilemaps.length; i++) {
      if (!goTilemaps[i].active) {
        continue;
      }
      this.#renderer.drawTilemap(goTilemaps[i]);
    }
    const goSprites = activeScene.getComponents(_Types.ComponentType.Sprite);
    for (let i = 0; i < goSprites.length; i++) {
      if (!goSprites[i].active) {
        continue;
      }
      if (goSprites[i].hasComponent(_Types.ComponentType.Body2D)) {
        const body = goSprites[i].getComponent(_Types.ComponentType.Body2D);
        if (_Collisions.Collisions.checkAABBCollision(body.AABB, cameraComponent.AABB)) {
          this.#renderer.drawQuad(goSprites[i]);
        }
      } else {
        this.#renderer.drawQuad(goSprites[i]);
      }
    }
    const goMeshes = activeScene.getComponents(_Types.ComponentType.Mesh);
    for (let i = 0; i < goMeshes.length; i++) {
      if (!goMeshes[i].active) {
        continue;
      }
      this.#renderer.drawMesh(goMeshes[i]);
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
    this.#renderer.endScene(dt);
    _Input.Input.mouseDelta.set(0, 0);
    this.#firstUpdate = false;
  }
}
exports.Engine = Engine;