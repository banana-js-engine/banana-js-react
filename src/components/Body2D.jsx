import { useEffect } from "react";
import { useGameObject } from "./GameObject";
import { useScene } from "./Scene";
import { Body2DComponent } from "../ecs/Component";
import { ComponentType, ShapeType } from "../core/Types";

/**
 * 
 * @param {{ shape: number, isStatic: boolean, gravityScale: number }} props 
 */
export function Body2D(props) {

    const ecs = useScene();
    const gameObjectId = useGameObject();

    useEffect(() => {
        if (props.shape == ShapeType.Circle) {
            ecs.emplace(gameObjectId, Body2DComponent.createCircleBody2D(
                gameObjectId,
                ecs,
                0.5,
                0.2,
                props.isStatic,
                0.6,
                props.gravityScale
            ));
        } else if (props.shape == ShapeType.Box) {
            ecs.emplace(gameObjectId, Body2DComponent.createBoxBody2D(
                gameObjectId,
                ecs,
                1,
                1,
                0.2,
                props.isStatic,
                0.6,
                props.gravityScale
            ));
        }
    }, []);

}