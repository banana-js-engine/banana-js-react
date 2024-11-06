import { useGameObject } from "./GameObject";
import { MeshComponent } from "../ecs/Component";
import { ComponentType } from "../core/Types";

/**
 * 
 * @param {{ objSrc: string, mtlSrc: string }} props 
 */
export function Mesh(props) {
    
    const gameObject = useGameObject();

    if (!gameObject.hasComponent(ComponentType.Mesh)) {
        gameObject.addComponent(new MeshComponent(gameObject, props.objSrc, props.mtlSrc));
    }
}