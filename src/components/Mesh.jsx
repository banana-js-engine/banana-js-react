import { useEffect } from "react";
import { useGameObject } from "./GameObject";
import { useScene } from "./Scene";
import { MeshComponent } from "../ecs/Component";
import { ComponentType } from "../core/Types";

/**
 * 
 * @param {{ objSrc: string, mtlSrc: string }} props 
 */
export function Mesh(props) {
    
    const ecs = useScene();
    const id = useGameObject();

    if (!ecs.has(id, ComponentType.Mesh)) {
        ecs.emplace(id, new MeshComponent(id, ecs, props.objSrc, props.mtlSrc));
    }
}