import { useEffect } from 'react';
import { useGL } from './Game';

export default function Camera(props) {

    /**
     * @type {WebGL2RenderingContext} the WebGL context
     */
    const gl = useGL();

    useEffect(() => {
        const c = props.bgColor;

        gl.clearColor(c[0], c[1], c[2], c[3]);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }, [props.bgColor, gl]);

    return null;
}