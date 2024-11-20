import { useEffect } from "react";
import { Color } from "../renderer/Color";
import { useGameObject } from "./GameObject";
import { UIButtonComponent } from "../ecs/Component";
import { ComponentType } from "../core/Types";

/**
 * 
 * @param {{ color: [number, number, number, number] | Color
 *           fontFamily: string,
 *           fontSize: number,
 *           x: number,
 *           y: number,
 *           width: number,
 *           height: number,
 *           onClick: Function }} props 
 */
export function UIButton(props) {

    const gameObject = useGameObject();

    if (!gameObject.hasComponent(ComponentType.UIButton)) {
        const buttonComponent = new UIButtonComponent(
            gameObject,
            props.x,
            props.y,
            props.children,
            props.color,
            props.fontFamily,
            props.fontSize,
            props.width,
            props.height,
            props.onClick
        ); 
    
        gameObject.addComponent(buttonComponent);
    } 

    useEffect(() => {
        gameObject.getComponent(ComponentType.UIButton).text = props.children;
    }, [props.children]);


}