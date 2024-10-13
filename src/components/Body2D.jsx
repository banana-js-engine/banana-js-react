import { useEffect } from "react";
import { useGameObject } from "./GameObject";
import { useScene } from "./Scene";
import { Body2DComponent } from "../ecs/Component";
import { ComponentType } from "../core/Types";

export default function Body2D(props) {

    const ecs = useScene();
    const gameObjectId = useGameObject();

    useEffect(() => {
        const transform = ecs.get(gameObjectId, ComponentType.Transform);
        ecs.emplace(gameObjectId, Body2DComponent.createCircleBody2D(
            transform,
            0.5,
            0.2,
            false,
            0.6,
            0
        ));
    }, []);

}