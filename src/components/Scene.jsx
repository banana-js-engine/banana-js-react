import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ECS } from '../ecs/ECS';
import { SceneManager } from '../ecs/SceneManager';
import { SceneECS } from '../ecs/SceneECS';

// gl context
const SceneContext = createContext(null);

export function useScene() {
    return useContext(SceneContext);
}

/**
 * 
 * @param props 
 * @returns 
 */
export function Scene(props) {

    const [prefabs, setPrefabs] = useState([]);

    const sceneRef = useRef(); 

    if (!sceneRef.current) {
        sceneRef.current = new SceneECS(new ECS());
        
        sceneRef.current.onPrefabCreated = () => {
            setPrefabs([...sceneRef.current.prefabs]);
        };
        
        SceneManager.addScene(sceneRef.current);
    }

    return (
        <SceneContext.Provider value={sceneRef.current}>
            { sceneRef.current && props.children }
            { sceneRef.current && prefabs }
        </SceneContext.Provider>
    );
}