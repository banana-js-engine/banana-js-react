import React, { createContext, useContext, useEffect, useRef } from 'react';
import { ECS } from '../ecs/ECS';
import { useEngine } from './Game';

// gl context
const SceneContext = createContext(null);

export function useScene() {
    return useContext(SceneContext);
}


export default function Scene(props) {

    const ecsRef = useRef(); 

    const engine = useEngine();

    ecsRef.current = new ECS();

    engine.addScene(ecsRef.current);

    return (
        <SceneContext.Provider value={ecsRef.current}>
            { ecsRef.current && props.children }
        </SceneContext.Provider>
    );
}