import { createContext, useContext, useRef } from "react";
import { useScene } from "./Scene";
import { GO } from "../ecs/GO";
import { useGL } from "./Game";
import { NameComponent, TransformComponent } from "../ecs/Component";
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

    // Only initialize once
    if (!gameObjectRef.current) {

        /**
         * @type {SceneECS} entity-component system
         */
        const scene = useScene();
        const handle = scene.createGameObject();
        const gl = useGL();

        
        gameObjectRef.current = new GO(scene, handle, gl, props.active);
        gameObjectRef.current.addComponent(new NameComponent(gameObjectRef.current, props.name));
    }

    return (
        <GameObjectContext.Provider value={gameObjectRef.current}>
            { props.children }
        </GameObjectContext.Provider>
    );
    
}