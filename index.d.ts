import React from "react"
import { Component } from "./src/ecs/Component"
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

    export function Body2D(props: {
        shape: ShapeType,
        isStatic: boolean,
        gravityScale: number
    }): void;

    export function Circle(props: {
        color: [number, number, number, number] | Color
    }): React.JSX.Element;

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
        name: string
    }): React.JSX.Element;

    export function Icosphere(props: { }): React.JSX.Element;

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

    // Classes
    export class Input {
        // Properties
        static mousePosition: Vector2;
        static mouseDelta: Vector2;
        
        // Methods
        static init(): void;
        static getKey(key: string): boolean;
        static getKeyDown(key: string): boolean;
        static getButton(button: number): boolean;
        static getButtonDown(button: number): boolean;
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
    }
    
    export const enum ShapeType {
        Box = 0,
        Circle = 1,
    }

    export class ScriptComponent extends Component {
        constructor(id: string, ecs: ECS);

        readonly type: ComponentType.Script;

        ready(): void;

        step(dt: number): void;

        onEnterViewport(): void;
        onExitViewport(): void;

        create(name?: string): string;

        destroy(component: Component | string): void;
    }

    export class SceneManager {
        static get activeScene(): ECS;

        static addScene(scene: ECS): void;
        static setActiveScene(index: number): void;
    }

    export class BananaMath {
        static toRadians(deg: number): number;
        static toDegrees(rad: number): number;
        static clamp(value: number, min: number, max: number): number;
        static clamp01(value: number): number;
    }

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