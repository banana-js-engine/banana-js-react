import React, { createContext, useContext, useEffect, useRef } from 'react';
import { ECS } from '../ecs/ECS';

// gl context
const SceneContext = createContext(null);

export function useScene() {
    return useContext(SceneContext);
}


export default function Scene(props) {

    const ecsRef = useRef(); 

    useEffect(() => {
        ecsRef.current = new ECS();
    }, [props.name]);

    return (
        <SceneContext.Provider value={ecsRef.current}>
            { ecsRef.current && props.children }
        </SceneContext.Provider>
    );
}