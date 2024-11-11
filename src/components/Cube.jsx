import { Mesh } from "./Mesh";

/**
 * 
 * @param {{ color }} props 
 * @returns 
 */
export function Cube(props) {
    
    return <Mesh objSrc="defaultModels/Cube.obj" mtlSrc="defaultModels/Cube.mtl" color={props.color}/>
}