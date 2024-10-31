import Sprite from "./Sprite";

/**
 * 
 * @param {{ color: [number, number, number, number] }} props 
 * @returns 
 */
export default function Circle(props) {

    return <Sprite src="defaultShapes/circle.png" color={props.color}/>
}