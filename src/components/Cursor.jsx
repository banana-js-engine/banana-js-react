import { useEffect } from "react";

/**
 * 
 * @param {{ src: string }} props 
* @returns 
*/
export function Cursor(props) {

    const canvas = document.getElementById('banana-canvas');

    useEffect(() => {
        if (!props.src) {
            return;
        }

        canvas.style.cursor = `url(${props.src}), auto`;
    }, []);
}