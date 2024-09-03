import { useEffect } from "react";
import { ECS } from "../ecs/ECS";
import { useScene } from "./Scene";
import { useGameObject } from "./GameObject";
import { ComponentType, SpriteComponent } from "../ecs/Component";
import { useGL } from "./Game";

/**
 * 
 * @param {{ color: [number, number, number, number], src: string 
 *           flipX: boolean, flipY: boolean }} props 
 * @returns 
 */
export default function Sprite(props) {

    /**
     * @type {ECS} entity-component system
     */
    const ecs = useScene();

    const gameObjectId = useGameObject();

    const gl = useGL();

    useEffect(() => {
        const transform = ecs.get(gameObjectId, ComponentType.Transform);
        ecs.emplace(gameObjectId, new SpriteComponent(gl, transform, props.color, props.src, props.flipX, props.flipY));
    }, []);

    return null;
}