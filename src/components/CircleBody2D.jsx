import { useGameObject } from "./GameObject";
import { Body2DComponent } from "../ecs/Component";
import { ComponentType } from "../core/Types";
import { useEffect } from "react";

/**
 * 
 * @param {{ isStatic: boolean, gravityScale: number, radius: number, density: number, restitution: number }} props 
 */
export function CircleBody2D(props) {
    
    const gameObject = useGameObject();

    if (!gameObject.hasComponent(ComponentType.Body2D)) {
        gameObject.addComponent(Body2DComponent.createCircleBody2D(
            gameObject,
            props.radius,
            props.density,
            props.isStatic,
            props.restitution,
            props.gravityScale
        ));
    }
}