import { useEffect } from "react";
import { useScene } from "./Scene";
import { useGameObject } from "./GameObject";

/**
 * 
 * @param {{ src: string }} props 
 * @returns 
 */
export default function Script(props) {

    /**
     * @type {ECS} entity-component system
     */
    const ecs = useScene();
    const gameObjectId = useGameObject();

    useEffect(() => {

        if (props.src) {
            import(`../scripts/${props.src}`).then(module => {
                const scriptComponent = Object.values(module)[0];

                ecs.emplace(gameObjectId, new scriptComponent(gameObjectId, ecs));
            })
            .catch((e) => {
                console.log(e);
            });
        }

        if (props.children) {
            // eval(props.children);
            (new Function(props.children))();
        }
    }, []);

    return null;
}