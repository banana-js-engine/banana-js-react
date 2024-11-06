import { useEffect } from "react";
import { useGameObject } from "./GameObject";
import { useScene } from "./Scene";
import { Body2DComponent } from "../ecs/Component";
import { ComponentType } from "../core/Types";
import { useGL } from "./Game";

/**
 * 
 * @param {{ isStatic: boolean, gravityScale: number, radius: number, density: number, restitution: number }} props 
 */
export function CircleBody2D(props) {
    
    const ecs = useScene();
    const id = useGameObject();
    const gl = useGL();

    if (!ecs.has(id, ComponentType.Body2D)) {
        ecs.emplace(id, Body2DComponent.createCircleBody2D(
            id,
            ecs,
            gl,
            props.radius,
            props.density,
            props.isStatic,
            props.restitution,
            props.gravityScale
        ));
    }
}