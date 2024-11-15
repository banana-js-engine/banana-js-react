import { Debug } from "../core/Debug";

/**
 * 
 * @param {{ showCollisionShapes, showContactPoints, shopFps }} props 
 */
export function DebugSettings(props) {
    if (typeof props.showCollisionShapes != 'undefined') {
        Debug.showCollisionShapes = props.showCollisionShapes;
    }

    if (typeof props.showContactPoints != 'undefined') {
        Debug.showContactPoints = props.showContactPoints;
    }

    if (typeof props.shopFps != 'undefined') {
        Debug.shopFps = props.shopFps;
    }
}