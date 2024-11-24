import { useGameObject } from "./GameObject";
import { Body2DComponent } from "../ecs/Component";
import { ComponentType } from "../core/Types";
import { useEffect } from "react";

/**
 * 
 * @param {{ isStatic: boolean, gravityScale: number, width: number, height: number
 *          density: number, restitution }} props 
 */
export function BoxBody2D(props) {
    
    const gameObject = useGameObject();

    if (!gameObject.hasComponent(ComponentType.Body2D)) {
        gameObject.addComponent(Body2DComponent.createBoxBody2D(
            gameObject,
            props.width,
            props.height,
            props.density,
            props.isStatic,
            props.restitution,
            props.gravityScale
        ));
    }

    useEffect(() => {
        const boxBody2D = gameObject.getComponent(ComponentType.Body2D);

        boxBody2D.gravityScale = props.gravityScale ? props.gravityScale : 1;
        boxBody2D.restitution = props.restitution ? props.restitution : 0.5;
        boxBody2D.isStatic = typeof props.isStatic == 'undefined' ? false : props.isStatic;
    });
}