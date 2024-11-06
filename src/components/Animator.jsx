import { createContext, useContext, useEffect, useRef } from "react";
import { useGameObject } from "./GameObject";
import { AnimatorComponent } from "../ecs/Component";
import { ComponentType } from "../core/Types";

const AnimatorContext = createContext(null);

export function useAnimator() {
    return useContext(AnimatorContext);
}

/**
 * 
 * @param {{ startAnim: string }} props 
 */
export function Animator(props) {

    const animatorRef = useRef();

    const gameObject = useGameObject();
    
    if (!gameObject.hasComponent(ComponentType.Animator)) {
        animatorRef.current = new AnimatorComponent(gameObject, props.startAnim);
        gameObject.addComponent(animatorRef.current);
    }
    
    return (
        <AnimatorContext.Provider value={animatorRef.current}>
            { animatorRef.current && props.children }
        </AnimatorContext.Provider>
    );
}