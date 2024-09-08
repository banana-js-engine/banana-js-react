import { useEffect } from "react";
import { useCanvas } from "./Game";

/**
 * 
 * @param {{ src: string }} props 
* @returns 
*/
export default function Cursor(props) {

    const canvas = useCanvas();

    useEffect(() => {
        if (!props.src) {
            return;
        }

        canvas.style.cursor = `url(${props.src}), auto`;
    }, []);
}