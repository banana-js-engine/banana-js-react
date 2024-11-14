import { ComponentType } from "../core/Types";
import { TilemapComponent } from "../ecs/Component";
import { useGameObject } from "./GameObject";

/**
 * 
 * @param {{ src: string, dataSrc: string, cellWidth, cellHeight }} props 
 */
export function Tilemap(props) {

    const gameObject = useGameObject();

    if (!gameObject.hasComponent(ComponentType.Tilemap)) {
        gameObject.addComponent(new TilemapComponent(
            gameObject,
            props.src,
            props.dataSrc,
            props.cellWidth,
            props.cellHeight
        ));
    }

}