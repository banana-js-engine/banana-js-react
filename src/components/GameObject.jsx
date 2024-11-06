import { createContext, useContext, useRef } from "react";
import { useScene } from "./Scene";
import { ECS } from "../ecs/ECS";
import { GO } from "../ecs/GO";
import { useGL } from "./Game";
import { NameComponent } from "../ecs/Component";

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
         * @type {ECS} entity-component system
         */
        const scene = useScene();
        const handle = scene.create();
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