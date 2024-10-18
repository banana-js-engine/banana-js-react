import { useEffect } from "react";
import { ECS } from "../ecs/ECS";
import { useScene } from "./Scene";
import { useGameObject } from "./GameObject";
import { SpriteComponent } from "../ecs/Component";
import { ComponentType } from "../core/Types";
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
        ecs.emplace(gameObjectId, new SpriteComponent(
            gameObjectId,
            ecs, 
            gl, 
            props.color, 
            props.src, 
            props.flipX, 
            props.flipY
        ));
    }, []);

    return null;
}