import { useEffect } from "react";
import { useScene } from "./Scene";
import { useGameObject } from "./GameObject";
import { ScriptComponent } from "../ecs/Component";

/**
 * 
 * @param {{ import: Promise }} props 
 * @returns 
 */
export default function Script(props) {

    /**
     * @type {ECS} entity-component system
     */
    const ecs = useScene();
    const gameObjectId = useGameObject();

    useEffect(() => {

        if (props.import) {
            props.import.then(module => {
                const scriptComponent = Object.values(module)[0];

                ecs.emplace(gameObjectId, new scriptComponent(gameObjectId, ecs));
            })
            .catch((e) => {
                console.log(e);
            });
        }

        if (props.children) {
            let script = `return ${props.children.replace(/\n/g, '')}`;

            const functions = new Function(script);            

            const scriptComponent = new ScriptComponent(gameObjectId, ecs);

            scriptComponent.ready = () => {
                (functions())();
            }

            ecs.emplace(gameObjectId, scriptComponent);
        }
    }, []);

    return null;
}