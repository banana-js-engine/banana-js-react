import { useEffect } from "react";
import { ECS } from "../ecs/ECS";
import { useScene } from "./Scene";
import { useGameObject } from "./GameObject";
import { SpriteComponent } from "../ecs/Component";
import { useGL } from "./Game";

/**
 * 
 * @param {{ color: [number, number, number, number], src: string }} props 
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
        ecs.emplace(gameObjectId, new SpriteComponent(gl, props.color, props.src));
    }, []);

    return null;
}