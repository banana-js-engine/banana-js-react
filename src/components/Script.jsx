import { useEffect } from "react";
import { useScene } from "./Scene";
import { useGameObject } from "./GameObject";
import { ScriptComponent } from "../ecs/Component";

/**
 * 
 * @param {{ import: Promise }} props 
 * @returns 
 */
export function Script(props) {

    /**
     * @type {ECS} entity-component system
     */
    const ecs = useScene();
    const id = useGameObject();

    const properties = Object.entries(props).filter(([key, value]) => value)

    useEffect(() => {

        if (props.import) {
            props.import.then(module => {
                const scriptComponent = Object.values(module)[0];

                const scriptComponentIns = new scriptComponent(id, ecs);

                for (let i = 0; i < properties.length; i++) {
                    scriptComponentIns[properties[i][0]] = properties[i][1];
                } 

                ecs.emplace(id, scriptComponentIns);
            })
            .catch((e) => {
                console.log(e);
            });
        }

        if (props.children) {
            let script = `return ${props.children.replace(/\n/g, '')}`;

            const functions = new Function(script);            

            const scriptComponent = new ScriptComponent(id, ecs);

            scriptComponent.ready = () => {
                (functions())();
            }

            ecs.emplace(gameObjectId, scriptComponent);
        }
    }, []);
}
