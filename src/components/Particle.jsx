import { ComponentType } from "../core/Types";
import { ParticleComponent } from "../ecs/Component";
import { useGameObject } from "./GameObject"

/**
 * 
 * @param {{ count, minAge, maxAge, minTheta, maxTheta, minSpeed, maxSpeed, gravity, color }} props 
 */
export function Particle(props) {

    const gameObject = useGameObject();

    if (!gameObject.hasComponent(ComponentType.Particle)) {
        gameObject.addComponent(new ParticleComponent(
            gameObject,
            props.count,
            props.minAge,
            props.maxAge,
            props.minTheta,
            props.maxTheta,
            props.minSpeed,
            props.maxSpeed,
            props.gravity,
            props.color
        ));
    }

}