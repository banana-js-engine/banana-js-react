import React, { createContext, useContext, useEffect, useRef } from 'react';
import { ECS } from '../ecs/ECS';
import { SceneManager } from '../ecs/SceneManager';

// gl context
const SceneContext = createContext(null);

export function useScene() {
    return useContext(SceneContext);
}


export default function Scene(props) {

    const ecsRef = useRef(); 

    ecsRef.current = new ECS();

    SceneManager.addScene(ecsRef.current);

    return (
        <SceneContext.Provider value={ecsRef.current}>
            { ecsRef.current && props.children }
        </SceneContext.Provider>
    );
}