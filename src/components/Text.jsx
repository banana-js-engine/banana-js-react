import { useEffect } from "react";
import { Color } from "../renderer/Color";
import { useGameObject } from "./GameObject";
import { useScene } from "./Scene";
import { TextComponent } from "../ecs/Component";

/**
 * 
 * @param {{ color: [number, number, number, number] | Color
 *           fontFamily: string,
 *           fontSize: number }} props 
 */
export function Text(props) {

    const ecs = useScene();
    const id = useGameObject();

    useEffect(() => {
        ecs.emplace(id, new TextComponent(
            id,
            ecs,
            props.children,
            props.color,
            props.fontFamily,
            props.fontSize
        ));
    });

}