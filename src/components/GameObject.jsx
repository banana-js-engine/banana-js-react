import { createContext, useContext, useRef } from "react";
import { useScene } from "./Scene";
import { ECS } from "../ecs/ECS";

const GameObjectContext = createContext(null);

export function useGameObject() {
    return useContext(GameObjectContext);
}

export default function GameObject(props) {

    const gameObjectRef = useRef();

    /**
     * @type {ECS} entity-component system
     */
    const ecs = useScene();

    gameObjectRef.current = ecs.create();


    return (
        <GameObjectContext.Provider value={gameObjectRef.current}>
            { props.children }
        </GameObjectContext.Provider>
    );
    
}