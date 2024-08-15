import { useEffect } from "react";
import { ECS } from "../ecs/ECS";
import { useScene } from "./Scene";
import { useGameObject } from "./GameObject";
import { SpriteComponent } from "../ecs/Component";

/**
 * 
 * @param {{ color: [number, number, number, number] }} props 
 * @returns 
 */
export default function Sprite(props) {

    /**
     * @type {ECS} entity-component system
     */
    const ecs = useScene();
    const gameObjectId = useGameObject();

    useEffect(() => {
        ecs.emplace(gameObjectId, new SpriteComponent(props.color));
    }, []);

    return null;
}