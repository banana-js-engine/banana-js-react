import { createContext, useContext, useEffect, useRef } from "react";
import { useGameObject } from "./GameObject";
import { useScene } from "./Scene";
import { AnimatorComponent } from "../ecs/Component";
import { ComponentType } from "../core/Types";
import { useGL } from "./Game";

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
    const gl = useGL();

    const animatorRef = useRef();

    if (!ecs.has(id, ComponentType.Animator)) {
        animatorRef.current = new AnimatorComponent(id, ecs, gl, props.startAnim);
        ecs.emplace(id, animatorRef.current);
    }
    
    return (
        <AnimatorContext.Provider value={animatorRef.current}>
            { animatorRef.current && props.children }
        </AnimatorContext.Provider>
    );
}