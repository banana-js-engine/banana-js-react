import { useEffect } from 'react';
import { useGL } from './Game';

export default function Test() {

    /**
     * @type {WebGL2RenderingContext} the WebGL context
     */
    const gl = useGL();

    useEffect(() => {
        gl.clearColor(1, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }, [gl]);

    return null;
}