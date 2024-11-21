import { createContext, useContext, useEffect, useRef } from "react";
import { useScene } from "./Scene";
import { GO } from "../ecs/GO";
import { useGL } from "./Game";
import { NameComponent } from "../ecs/Component";
import { SceneECS } from "../ecs/SceneECS";

const GameObjectContext = createContext(null);

/**
 * @returns {GO}
 */
export function useGameObject() {
    return useContext(GameObjectContext);
}

/**
 * @param {{ name: string, active: boolean }} props 
 */
export function GameObject(props) {

    const gameObjectRef = useRef();

    const parent = useGameObject();

    // Only initialize once
    if (!gameObjectRef.current) {

        /**
         * @type {SceneECS} entity-component system
         */
        const scene = useScene();
        const handle = scene.createGameObject();
        const gl = useGL();

        
        gameObjectRef.current = new GO(scene, handle, gl, props.active, parent);
        gameObjectRef.current.addComponent(new NameComponent(gameObjectRef.current, props.name));
    }

    useEffect(() => {
        gameObjectRef.current.active = typeof props.active == 'undefined' ? true : props.active;
    }, [props.active]);

    return (
        <GameObjectContext.Provider value={gameObjectRef.current}>
            { props.children }
        </GameObjectContext.Provider>
    );
    
}