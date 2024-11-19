import { ComponentType } from "../core/Types";
import { TimerComponent } from "../ecs/Component";
import { useGameObject } from "./GameObject";

/**
 * 
 * @param {{ duration: number, oneShot: boolean, onTimerEnd: Function }} props 
 */
export function Timer(props) {

    const gameObject = useGameObject();

    if (!gameObject.hasComponent(ComponentType.Timer)) {
        gameObject.addComponent(new TimerComponent (
            gameObject,
            props.duration,
            props.oneShot,
            props.onTimerEnd
        ));
    }

}