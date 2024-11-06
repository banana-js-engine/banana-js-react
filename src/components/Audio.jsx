import { useGameObject } from "./GameObject";
import { AudioComponent } from "../ecs/Component";
import { useAudioContext } from "./Game";
import { ComponentType } from "../core/Types";

/**
 * 
 * @param {{ src: string, volume: number, playOnStart: boolean, loop: boolean }} props 
 */
export function Audio(props) {

    const gameObject = useGameObject();

    /**
     * @type {AudioContext}
     */
    const audioContext = useAudioContext();

    if (!gameObject.hasComponent(ComponentType.Audio)) {
        fetch(props.src)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(buffer => {
                gameObject.addComponent(new AudioComponent(
                    gameObject,
                    audioContext, 
                    buffer, 
                    props.volume, 
                    props.playOnStart, 
                    props.loop
                ));
            });
    }
}