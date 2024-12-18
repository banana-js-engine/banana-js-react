import { useGameObject } from "./GameObject";
import { SpriteComponent } from "../ecs/Component";
import { ComponentType } from "../core/Types";
import { useEffect } from "react";

/**
 * 
 * @param {{ color: [number, number, number, number], src: string 
 *           flipX: boolean, flipY: boolean }} props 
 * @returns 
 */
export function Sprite(props) {

    const gameObject = useGameObject();

    if (!gameObject.hasComponent(ComponentType.Sprite)) {
        gameObject.addComponent(new SpriteComponent(
            gameObject,
            props.src,
            props.color,
            props.flipX,
            props.flipY
        ));
    }
}