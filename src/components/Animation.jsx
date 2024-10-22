import { useAnimator } from "./Animator";
import { useGL } from "./Game";
import { AnimationClip } from "../renderer/AnimationClip";

/**
 * 
 * @param {{ src: string, name: string, frames: number, firstFrame: number, length: number, cellWidth: number, cellHeight: number }} props 
 */
export default function Animation(props) {

    const animator = useAnimator();
    const gl = useGL();

    const animation = new AnimationClip(
        gl, 
        props.src, 
        props.name, 
        props.frames,
        props.firstFrame,  
        props.length, 
        props.cellWidth, 
        props.cellHeight
    );
    animator.addAnimation(animation);
}