import { ComponentType } from "../core/Types";
import { DialogueComponent } from "../ecs/Component";
import { useGameObject } from "./GameObject";

/**
 * 
 * @param {{ rollDuration, color, fontFamily: string, fontSize, skipKey, playOnStart: boolean }} props 
 */
export function Dialogue(props) {

    const gameObject = useGameObject();

    const dialogue = [];
    if (!props.children[0]) {
        dialogue.push(props.children.props.children);
    } else {
        for (const child of props.children) {
            dialogue.push(child.props.children);
        }
    }

    if (!gameObject.hasComponent(ComponentType.Dialogue)) {
        gameObject.addComponent(new DialogueComponent(
            gameObject,
            dialogue,
            props.rollDuration,
            props.color,
            props.fontFamily,
            props.fontSize,
            props.skipKey,
            props.playOnStart
        ));
    }

}