import { Mesh } from "./Mesh";

/**
 * 
 * @param {{ color }} props 
 * @returns 
 */
export function Icosphere(props) {
    return <Mesh objSrc="defaultModels/Icosphere.obj" mtlSrc="defaultModels/Icosphere.mtl" color={props.color}/>
}