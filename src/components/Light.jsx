import { useEffect } from "react";
import { ComponentType } from "../core/Types";
import { LightComponent } from "../ecs/Component";
import { useGameObject } from "./GameObject";

/**
 * 
 * @param {{ color, intensity }} props 
 */
export function Light(props) {

    const gameObject = useGameObject();

    if (!gameObject.hasComponent(ComponentType.Light)) {
        gameObject.addComponent(new LightComponent(
            gameObject,
            props.color,
            props.intensity
        ));
    }

    useEffect(() => {
        const light = gameObject.getComponent(ComponentType.Light);
        light.intensity = props.intensity ? props.intensity : 1;
        light.color = props.color ? props.color : [1, 1, 1, 1];
    }, [props.intensity, props.color]);
}