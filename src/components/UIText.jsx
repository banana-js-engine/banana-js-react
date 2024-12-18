import { useEffect } from "react";
import { Color } from "../renderer/Color";
import { useGameObject } from "./GameObject";
import { UITextComponent } from "../ecs/Component";
import { ComponentType } from "../core/Types";

/**
 * 
 * @param {{ color: [number, number, number, number] | Color
 *           fontFamily: string,
 *           fontSize: number,
 *           x: number,
 *           y: number }} props 
 */
export function UIText(props) {

    const gameObject = useGameObject();

    useEffect(() => {
        if (!gameObject) {
            return;
        }

        gameObject.getComponent(ComponentType.UIText).text = props.children;
    }, [props.children]);

    if (!gameObject.hasComponent(ComponentType.UIText)) {
        const textComponent = new UITextComponent(
            gameObject,
            props.x,
            props.y,
            props.children,
            props.color,
            props.fontFamily,
            props.fontSize
        ); 
    
        gameObject.addComponent(textComponent);
    } 
}