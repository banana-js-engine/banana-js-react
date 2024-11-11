import { Mesh } from "./Mesh";

/**
 * 
 * @param {{ color }} props 
 * @returns 
 */
export function Torus(props) {
    return <Mesh objSrc="defaultModels/Torus.obj" mtlSrc="defaultModels/Torus.mtl" color={props.color}/>
}