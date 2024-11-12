import React from "react"
import { ECS } from "./src/ecs/ECS"

declare module "@mfkucuk/banana-js" {
    // Component (functions)
    export function Animation(props: {
        src: string,
        name: string,
        frames: number,
        firstFrame: number,
        length: number,
        cellWidth: number,
        cellHeight: number 
    }): void;

    export function Animator(props: { startAnim: string }): React.JSX.Element;

    export function Audio(props: {
        src: string,
        volume: number,
        playOnStart: boolean,
        loop: boolean
    }): void;

    export function BoxBody2D(props: {
        isStatic: boolean,
        gravityScale: number,
        width: number,
        height: number,
        density: number,
        restitution: number,
    }): void;

    export function Circle(props: {
        color: [number, number, number, number] | Color
    }): React.JSX.Element;

    export function CircleBody2D(props: {
        isStatic: boolean,
        gravityScale: number,
        radius: number,
        density: number,
        restitution: number,
    }): void;

    export function Cube(props: { }): React.JSX.Element;

    export function Cursor(props: {
        src: string
    }): void;

    export function Cylinder(props: { }): React.JSX.Element;

    export function Game(props: {
        name: string,
        width: number,
        height: number
    }): React.JSX.Element;

    export function GameObject(props: {
        name: string,
        active: boolean
    }): React.JSX.Element;

    export function Icosphere(props: { }): React.JSX.Element;

    export function Light(props: {
        direction: [number, number, number] | Vector3,
        color: [number, number, number, number] | Color
    }): void;

    export function Mesh(props: {
        objSrc: string,
        mtlSrc: string
    }): void;

    export function OrthographicCamera(props: {
        bgColor: [number, number, number, number] | Color
        size: number,
        near: number,
        far: number
    }): void;

    export function Particle(props: {
        count: number,
        minAge: number,
        maxAge: number,
        minTheta: number,
        maxTheta: number,
        minSpeed: number,
        maxSpeed: number,
        gravity: [number, number, number] | Vector3
    }): void;

    export function PerspectiveCamera(props: {
        bgColor: [number, number, number, number] | Color
        fovy: number,
        near: number,
        far: number
    }): void;

    export function Scene(props: { }): React.JSX.Element;

    export function Script(props: {
        import: Promise
    }): void;

    export function Sphere(props: { }): React.JSX.Element;

    export function Sprite(props: {
        color: [number, number, number, number] | Color,
        src: string,
        flipX: boolean,
        flipY: boolean
    }): void;

    export function Text(props: {
        color: [number, number, number, number] | Color,
        fontFamily: string,
        fontSize: number
    }): void;

    export function Torus(props: { }): React.JSX.Element;

    export function Transform(props: {
        position: [number, number, number] | Vector3,
        rotation: [number, number, number] | Vector3,
        scale   : [number, number, number] | Vector3,
    }): void;

    export function UIText(props: {
        color: [number, number, number, number] | Color,
        fontFamily: string,
        fontSize: number,
        x: number,
        y: number
    }): void;

    // Classes
    export class Input {
        // Properties
        static mousePosition: Vector2;
        static mouseDelta: Vector2;
        static touchPosition: Vector2;
        
        // Methods
        static init(): void;
        static getKey(key: string): boolean;
        static getKeyDown(key: string): boolean;
        static getButton(button: number): boolean;
        static getButtonDown(button: number): boolean;
        static getTap(): boolean
        static getGamepadButton(button: number, gamepad?: number): boolean;
        static isGamepadConnected(gamepad?: number): boolean;
    }

    export const enum ComponentType {
        None = -1,
        Transform = 0,
        Sprite = 1,
        Camera = 2,
        Script = 3,
        Audio = 4,
        Body2D = 5,
        Name = 6,
        Animator = 7,
        Mesh = 8,
        Text = 9,
        UIText = 10,
        Light = 11,
    }
    
    export const enum ShapeType {
        Box = 0,
        Circle = 1,
    }

    export const enum KeyCode {
        UpArrow = 'arrowup',
        DownArrow = 'arrowdown',
        LeftArrow = 'arrowleft',
        RightArrow = 'arrowright',
        Space = ' ',
        Escape = 'escape',
        Enter = 'enter',
        A = 'a',
        B = 'b',
        C = 'c',
        D = 'd',
        E = 'e',
        F = 'f',
        G = 'g',
        H = 'h',
        I = 'i',
        J = 'j',
        K = 'k',
        L = 'l',
        M = 'm',
        N = 'n',
        O = 'o',
        P = 'p',
        Q = 'q',
        R = 'r',
        S = 's',
        T = 't',
        U = 'u',
        V = 'v',
        W = 'w',
        X = 'x',
        Y = 'y',
        Z = 'z',
        Alpha0 = '0',
        Alpha1 = '1',
        Alpha2 = '2',
        Alpha3 = '3',
        Alpha4 = '4',
        Alpha5 = '5',
        Alpha6 = '6',
        Alpha7 = '7',
        Alpha8 = '8',
        Alpha9 = '9',
    }
    
    export const enum MouseButtonCode {
        Left = 0,
        Middle = 1,
        Right = 2,
    }
    
    export const enum GamepadButtonCode {
        A = 0,
        B = 1,
        X = 2,
        Y = 3,
        DpadUp = 12 ,
        DpadDown = 13,
        DpadLeft = 14,
        DpadRight = 15,
    };

    export class BaseComponent {

        gameObject: GO;

        get active(): boolean;
        get transform(): TransformComponent;
        get mainCamera(): CameraComponent;

        getComponent<T extends BaseComponent>(type: ComponentType): T;
        hasComponent(type: ComponentType): boolean;
        addComponent<T extends BaseComponent>(component: T): T;
    }

    export class NameComponent extends BaseComponent {
        get name(): string;
        set name(newName: string): void;
    }

    export class TransformComponent extends BaseComponent {
        get transformMatrix(): Matrix4;
        get position(): Vector3;
        get rotation(): Vector3;
        get scale(): Vector3;

        moveTo(x: Vector2 | number, y: number, z: number): void;
        moveBy(x: Vector2 | number, y: number, z: number): void;
        rotateTo(x: number, y: number, z: number): void;
        rotateBy(x: number, y: number, z: number): void;
        scaleTo(x: number, y: number, z: number): void;
        scaleBy(x: number, y: number, z: number): void;
    }

    export class SpriteComponent extends BaseComponent {
        get texture(): Texture;
        set texture(newTexture: Texture): void;
        get color(): Vector4;
        setColor(r: Vector4 | number, g: number, b: number, a: number): void

        get flipX(): boolean;
        get flipY(): boolean;
        set flipX(newValue: boolean): void;
        get flipY(newValue: boolean): void;
    }

    export class CameraComponent extends BaseComponent {
        setClearColor(r: number, g: number, b: number, a: number): void;
        screenToWorldSpace(vector: Vector2): Vector3;
        worldToScreenSpace(vector: Vector3): Vector2;
    }

    export class ScriptComponent extends BaseComponent {
        constructor(id: string, ecs: ECS);

        readonly type: ComponentType.Script;

        ready(): void;
        step(dt: number): void;
        onEnterViewport(): void;
        onExitViewport(): void;
        onCollisionEnter2D(other: Body2DComponent): void;
        onCollisionExit2D(other: Body2DComponent): void;

        createPrefab(prefab: React.ReactNode): void;
        createGameObject(name?: string): string;
        destroyGameObject(gameObject: GO): void;
    }

    export class AudioComponent extends BaseComponent {
        play(): void;
        stop(): void;
        playOnce(): void;
        pause(): void;
        setVolume(volume: number): void;
    }

    export class Body2DComponent extends BaseComponent {
        get linearVelocity(): Vector2;
        addForce(amount: Vector2): void; 
    }

    export class AnimatorComponent extends BaseComponent {
        playAnimation(animationName: string): void;
        stopAnimation(): void;
    }

    export class TextComponent extends BaseComponent {
        get text(): string;
        set text(newText: string): void;
        get color(): Vector4;
    }

    export class LightComponent extends BaseComponent {
        get direction(): Vector3;
        get color(): Color;
    }

    export class ParticleComponent extends BaseComponent {
        play(): void;
        stop(): void;   
    }

    export class GO {
        active: boolean;

        createGameObject(name: string): GO;
        destroyGameObject(GameObject: GO): void;
        getComponent<T extends BaseComponent>(type: ComponentType): T;
        getComponents<T extends BaseComponent>(type: ComponentType): T[];
        hasComponent(type: ComponentType): boolean;
        addComponent<T extends BaseComponent>(component: T): T;
        addEmptyComponent<T extends BaseComponent>(type: ComponentType): T; 
    }

    export class SceneECS {
        prefabs: React.ReactNode[];
    
        createPrefab(prefab: React.ReactNode): void;
        createGameObject(): string;
        destroyGameObject(gameObject: GO): void;
        addComponent(handle: string, component: Component): Component | undefined;
        addEmptyComponent(go: GO, type: ComponentType): Component | undefined;
        getComponent(handle: string, type: ComponentType): Component | null;
        getComponents(type: ComponentType): Component[];
        hasComponent(handle: string, type: ComponentType): boolean;
        getComponentsWithIds(type: ComponentType): Record<string, Component>;
        groupComponents(...types: ComponentType[]): Component[][];
    }

    export class SceneManager {
        static get activeScene(): ECS;

        static addScene(scene: ECS): void;
        static setActiveScene(index: number): void;
    }

    export function toRadians(deg: number): number;
    export function toDegrees(rad: number): number;
    export function clamp(value: number, min: number, max: number): number;
    export function clamp01(value: number): number;

    export class Matrix4 {
        static get zero(): Matrix4;

        get flat(): Float32Array;
        zero(): Matrix4;
        identity(): Matrix4;
        multiply(other: Matrix4): Matrix4;
        multiplyVector3(vec3: Vector3): Vector3;
        multiplyVector4(vec4: Vector4): Vector4;
        transpose(): Matrix4;
        invert(): Matrix4;
        setTranslation(vec3: Vector3): Matrix4;
        setRotationX(ang: number): Matrix4;
        setRotationY(ang: number): Matrix4;
        setRotationZ(ang: number): Matrix4;
        setScale(vec3: Vector3): Matrix4;
        applyPerspective(fovy: number, aspect: number, near: number, far: number): Matrix4;
        setPerspective(fovy: number, aspect: number, near: number, far: number): Matrix4;
        applyOrtho(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;
        setOrtho(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;
    }

    export class Vector2 {
        get x(): number;
        get y(): number;

        set x(newX: number): void;
        set y(newY: number): void;

        set(x: number | Vector2, y?: number): void;

        get length(): number;
        get lengthSquared(): number;
        get normalized(): Vector2;
        normalize(): Vector2;
        distance(to: Vector2): number;
        distanceSquared(to: Vector2): number;

        add(other: Vector2): Vector2;
        sub(other: Vector2): Vector2;
        mul(scalar: number): Vector2;
        div(scalar: number): Vector2;

        dot(other: Vector2): number;
        equals(other: Vector2): boolean;
        
        static get zero(): Vector2;
        static get one(): Vector2;
        static get right(): Vector2;
        static get left(): Vector2;
        static get up(): Vector2;
        static get down(): Vector2;
    }

    export class Vector3 extends Vector2 {
        get z(): number;
        set z(newZ: number): void;

        set(x: number | Vector3 | Vector2, y?: number, z?: number): void;
    }

    export class Vector4 extends Vector3 {
        get w(): number;
        set w(newW: number): void;

        set(x: number | Vector4, y?: number, z?: number, w?: number): void;

        get hex(): string;
    }

    export class Color {
        static get black(): Vector4;
        static get red(): Vector4;
        static get green(): Vector4;
        static get blue(): Vector4;
        static get purple(): Vector4;
        static get yellow(): Vector4;
        static get orange(): Vector4;
        static get cyan(): Vector4;
        static get white(): Vector4;
        static get transparent(): Vector4;
    }
}