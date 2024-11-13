import React, { createContext, useContext, useRef, useState } from 'react';
import { ECS } from '../ecs/ECS';
import { SceneManager } from '../ecs/SceneManager';
import { SceneECS } from '../ecs/SceneECS';
import { GameObject } from "./GameObject";
import { UIText } from "./UIText";
import { Script } from "./Script";
import { Debug } from '../core/Debug';

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

            <GameObject name="FPS_UI" active={Debug.showFps}>
                <UIText x={10} y={30} fontSize={30} color={[1, 1, 1, 1]}>FPS: 60</UIText>
                <Script import={import('../scripts/FPSScript')}/>
            </GameObject>
        </SceneContext.Provider>
    );
}