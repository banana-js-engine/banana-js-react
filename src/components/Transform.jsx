import { ECS } from "../ecs/ECS";
import { useScene } from "./Scene";
import { useGameObject } from "./GameObject";
import { TransformComponent } from "../ecs/Component";
import { ComponentType } from "../core/Types";
import { useGL } from "./Game";

/**
 * 
 * @param {{ position: [number, number, number], 
 *           rotation: [number, number, number], 
 *           scale: [number, number, number] }} props 
 * @returns 
 */
export function Transform(props) {

    /**
     * @type {ECS} entity-component system
     */
    const ecs = useScene();
    const id = useGameObject();
    const gl = useGL();

    if (!ecs.has(id, ComponentType.Transform)) {
        ecs.emplace(id, new TransformComponent(
            id,
            ecs, 
            gl,
            props.position, 
            props.rotation, 
            props.scale
        ));
    }
}