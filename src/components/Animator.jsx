import { createContext, useContext, useEffect, useRef } from "react";
import { useGameObject } from "./GameObject";
import { useScene } from "./Scene";
import { AnimatorComponent } from "../ecs/Component";

const AnimatorContext = createContext(null);

export function useAnimator() {
    return useContext(AnimatorContext);
}

/**
 * 
 * @param {{ startAnim: string }} props 
 */
export function Animator(props) {


    const ecs = useScene();
    const id = useGameObject();

    const animatorRef = useRef();

    animatorRef.current = new AnimatorComponent(id, ecs, props.startAnim);
    
    useEffect(() => {
        ecs.emplace(id, animatorRef.current);
    }, []);

    return (
        <AnimatorContext.Provider value={animatorRef.current}>
            { animatorRef.current && props.children }
        </AnimatorContext.Provider>
    );
}