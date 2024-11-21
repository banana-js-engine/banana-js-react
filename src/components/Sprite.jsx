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

    if (!gameObject.hasComponent(ComponentType.Sprite))
        gameObject.addComponent(new SpriteComponent(
            gameObject,
            props.src
    ));

    useEffect(() => {
        const sprite = gameObject.getComponent(ComponentType.Sprite);
        sprite.color = props.color ? props.color : [1, 1, 1, 1];
        sprite.flipX = typeof props.flipX == 'undefined' ? false : props.flipX;
        sprite.flipY = typeof props.flipY == 'undefined' ? false : props.flipY;
    }, []);
}