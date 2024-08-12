import { useEffect } from "react";
import { ECS } from "../ecs/ECS";
import { useScene } from "./Scene";
import { useGameObject } from "./GameObject";
import { TransformComponent } from "../ecs/Component";

export default function Transform(props) {

    /**
     * @type {ECS} entity-component system
     */
    const ecs = useScene();
    const gameObjectId = useGameObject();

    useEffect(() => {
        ecs.emplace(gameObjectId, new TransformComponent(props.position, props.rotation, props.scale));
    }, [props.position, props.rotation, props.scale]);

    return null;
}