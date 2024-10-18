import { useEffect } from "react";
import { useGameObject } from "./GameObject";
import { useScene } from "./Scene";
import { AudioComponent } from "../ecs/Component";
import { useAudioContext } from "./Game";

/**
 * 
 * @param {{ src: string, volume: number, playOnStart: boolean, loop: boolean }} props 
 */
export default function Audio(props) {

    const ecs = useScene();
    const gameObjectId = useGameObject();

    /**
     * @type {AudioContext}
     */
    const audioContext = useAudioContext();

    useEffect(() => {
        fetch(props.src)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(buffer => {
                ecs.emplace(gameObjectId, new AudioComponent(
                    gameObjectId,
                    ecs, 
                    audioContext, 
                    buffer, 
                    props.volume, 
                    props.playOnStart, 
                    props.loop
                ));
            });
    }, []);

}