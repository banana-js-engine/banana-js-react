import { Debug } from "../core/Debug";

/**
 * 
 * @param {{ showCollisionShapes: boolean, showContactPoints: boolean, showFps: boolean }} props 
 */
export function DebugSettings(props) {
    if (typeof props.showCollisionShapes != 'undefined') {
        Debug.showCollisionShapes = props.showCollisionShapes;
    }

    if (typeof props.showContactPoints != 'undefined') {
        Debug.showContactPoints = props.showContactPoints;
    }

    if (typeof props.showFps != 'undefined') {
        Debug.showFps = props.showFps;
    }
}