import { useEffect } from "react";
import { Color } from "../renderer/Color";
import { useGameObject } from "./GameObject";
import { useScene } from "./Scene";
import { TextComponent } from "../ecs/Component";
import { ComponentType } from "../core/Types";
import { useGL } from "./Game";

/**
 * 
 * @param {{ color: [number, number, number, number] | Color
 *           fontFamily: string,
 *           fontSize: number }} props 
 */
export function Text(props) {

    const ecs = useScene();
    const id = useGameObject();
    const gl = useGL();

    if (!ecs.has(id, ComponentType.Text)) {
        const textComponent = new TextComponent(
            id,
            ecs,
            gl,
            props.children,
            props.color,
            props.fontFamily,
            props.fontSize
        ) 
    
        ecs.emplace(id, textComponent);
    } 

    useEffect(() => {
        ecs.get(id, ComponentType.Text).text = props.children;
    }, [props.children]);


}