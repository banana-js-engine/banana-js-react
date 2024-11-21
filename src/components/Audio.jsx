import { useGameObject } from "./GameObject";
import { AudioComponent } from "../ecs/Component";
import { useAudioContext } from "./Game";
import { ComponentType } from "../core/Types";
import { useEffect } from "react";

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

    useEffect(() => {
        if (gameObject.hasComponent(ComponentType.Audio)) {
            const audio = gameObject.getComponent(ComponentType.Audio);
            const volume = props.volume ? props.volume : 0.5;
            audio.setVolume(volume);
        }
    }, [props.volume]);
}