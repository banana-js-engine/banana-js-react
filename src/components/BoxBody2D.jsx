import { useGameObject } from "./GameObject";
import { useScene } from "./Scene";
import { Body2DComponent } from "../ecs/Component";
import { ComponentType } from "../core/Types";

/**
 * 
 * @param {{ isStatic: boolean, gravityScale: number, width: number, height: number
 *          density: number, restitution }} props 
 */
export function BoxBody2D(props) {
    
    const ecs = useScene();
    const id = useGameObject();

    if (!ecs.has(id, ComponentType.Body2D)) {
        ecs.emplace(id, Body2DComponent.createBoxBody2D(
            id,
            ecs,
            props.width,
            props.height,
            props.density,
            props.isStatic,
            props.restitution,
            props.gravityScale
        ));
    }
}