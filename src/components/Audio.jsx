import { useEffect } from "react";
import { useGameObject } from "./GameObject";
import { useScene } from "./Scene";
import { AudioComponent } from "../ecs/Component";
import { useAudioContext } from "./Game";
import { ComponentType } from "../core/Types";
import { useGL } from "./Game";

/**
 * 
 * @param {{ src: string, volume: number, playOnStart: boolean, loop: boolean }} props 
 */
export function Audio(props) {

    const ecs = useScene();
    const id = useGameObject();
    const gl = useGL();

    /**
     * @type {AudioContext}
     */
    const audioContext = useAudioContext();

    if (!ecs.has(id, ComponentType.Audio)) {
        fetch(props.src)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(buffer => {
                ecs.emplace(id, new AudioComponent(
                    id,
                    ecs, 
                    gl,
                    audioContext, 
                    buffer, 
                    props.volume, 
                    props.playOnStart, 
                    props.loop
                ));
            });
    }
}