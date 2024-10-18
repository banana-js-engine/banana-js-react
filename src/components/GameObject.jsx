import { createContext, useContext, useEffect, useRef } from "react";
import { useScene } from "./Scene";
import { ECS } from "../ecs/ECS";
import { NameComponent } from "../ecs/Component";

const GameObjectContext = createContext(null);

export function useGameObject() {
    return useContext(GameObjectContext);
}

/**
 * @param {{ name: string }} props 
 */
export default function GameObject(props) {

    const gameObjectRef = useRef();

    /**
     * @type {ECS} entity-component system
     */
    const ecs = useScene();

    gameObjectRef.current = ecs.create();
    ecs.emplace(gameObjectRef.current, new NameComponent(gameObjectRef.current, ecs, props.name));

    return (
        <GameObjectContext.Provider value={gameObjectRef.current}>
            { props.children }
        </GameObjectContext.Provider>
    );
    
}