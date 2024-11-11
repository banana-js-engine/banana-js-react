import { Mesh } from "./Mesh";

/**
 * 
 * @param {{ color }} props 
 * @returns 
 */
export function Sphere(props) {
    return <Mesh objSrc="defaultModels/Sphere.obj" mtlSrc="defaultModels/Sphere.mtl" color={props.color}/>
}