import { useGameObject } from "./GameObject";
import { ScriptComponent } from "../ecs/Component";
import { ComponentType } from "../core/Types";

/**
 * 
 * @param {{ import: Promise }} props 
 * @returns 
 */
export function Script(props) {

    const gameObject = useGameObject();

    const properties = Object.entries(props).filter(([key, value]) => value)

    if (!gameObject.hasComponent(ComponentType.Script)) {
        if (props.import) {
            props.import.then(module => {
                const scriptComponent = Object.values(module)[0];
    
                const scriptComponentIns = new scriptComponent(gameObject);
    
                for (let i = 0; i < properties.length; i++) {
                    scriptComponentIns[properties[i][0]] = properties[i][1];
                } 
    
                gameObject.addComponent(scriptComponentIns);
            })
            .catch((e) => {
                console.log(e);
            });
        }
    
        if (props.children) {
            let script = `return ${props.children.replace(/\n/g, '')}`;
    
            const functions = new Function(script);            
    
            const scriptComponent = new ScriptComponent(gameObject);
    
            scriptComponent.ready = () => {
                (functions())();
            }
    
            gameObject.addComponent(scriptComponent);
        }
    }
}
