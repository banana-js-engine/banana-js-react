import { Mesh } from "./Mesh";

/**
 * 
 * @param {{ color }} props 
 * @returns 
 */
export function Cylinder(props) {
    return <Mesh objSrc="defaultModels/Cylinder.obj" mtlSrc="defaultModels/Cylinder.mtl" color={props.color}/>
}