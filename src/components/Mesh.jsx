import { useEffect } from "react";
import { useGameObject } from "./GameObject";
import { useScene } from "./Scene";
import { MeshComponent } from "../ecs/Component";
import { ComponentType } from "../core/Types";
import { useGL } from "./Game";

/**
 * 
 * @param {{ objSrc: string, mtlSrc: string }} props 
 */
export function Mesh(props) {
    
    const ecs = useScene();
    const id = useGameObject();
    const gl = useGL();

    if (!ecs.has(id, ComponentType.Mesh)) {
        ecs.emplace(id, new MeshComponent(id, ecs, gl, props.objSrc, props.mtlSrc));
    }
}