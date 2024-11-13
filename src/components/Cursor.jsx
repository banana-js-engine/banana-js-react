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
            canvas.style.cursor = 'none';
            return;
        }

        canvas.style.cursor = `url(${props.src}), auto`;
    }, []);
}