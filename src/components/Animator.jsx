import { createContext, useContext, useEffect, useRef } from "react";
import { useGameObject } from "./GameObject";
import { useScene } from "./Scene";
import { AnimatorComponent } from "../ecs/Component";

const AnimatorContext = createContext(null);

export function useAnimator() {
    return useContext(AnimatorContext);
}

export default function Animator(props) {


    const ecs = useScene();
    const id = useGameObject();

    const animatorRef = useRef(new AnimatorComponent(id, ecs));

    useEffect(() => {
        ecs.emplace(id, animatorRef.current);
    }, []);

    return (
        <AnimatorContext.Provider value={animatorRef.current}>
            { animatorRef.current && props.children }
        </AnimatorContext.Provider>
    );
}