import { ComponentType } from "../core/Types";
import { LightComponent } from "../ecs/Component";
import { useGameObject } from "./GameObject";

/**
 * 
 * @param {{ direction, color }} props 
 */
export function Light(props) {

    const gameObject = useGameObject();

    if (!gameObject.hasComponent(ComponentType.Light)) {
        gameObject.addComponent(new LightComponent(
            gameObject,
            props.direction,
            props.color
        ));
    }
}