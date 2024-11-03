import { useEffect } from "react";
import { useGameObject } from "./GameObject";
import { useScene } from "./Scene";
import { Body2DComponent } from "../ecs/Component";

/**
 * 
 * @param {{ isStatic: boolean, gravityScale: number }} props 
 */
export function BoxBody2D(props) {
    
    const ecs = useScene();
    const id = useGameObject();

    useEffect(() => {
        ecs.emplace(id, Body2DComponent.createBoxBody2D(
            id,
            ecs,
            1,
            1,
            0.2,
            props.isStatic,
            0.6,
            props.gravityScale
        ));
    }, []);
}