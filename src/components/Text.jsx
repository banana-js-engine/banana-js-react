import { useEffect } from "react";
import { Color } from "../renderer/Color";
import { useGameObject } from "./GameObject";
import { TextComponent } from "../ecs/Component";
import { ComponentType } from "../core/Types";

/**
 * 
 * @param {{ color: [number, number, number, number] | Color
 *           fontFamily: string,
 *           fontSize: number }} props 
 */
export function Text(props) {

    const gameObject = useGameObject();

    if (!gameObject.hasComponent(ComponentType.Text)) {
        const textComponent = new TextComponent(
            gameObject,
            props.children,
            props.color,
            props.fontFamily,
            props.fontSize
        ) 
    
        gameObject.addComponent(textComponent);
    } 

    useEffect(() => {
        gameObject.getComponent(ComponentType.Text).text = props.children;
    }, [props.children]);


}