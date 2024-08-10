import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Renderer } from '../renderer/Renderer';
import { Engine } from '../core/Engine';

// gl context
const GLContext = createContext(null);

export function useGL() {
    return useContext(GLContext);
}

// renderer context
const RendererContext = createContext(null);

export function useRenderer() {
    return useContext(RendererContext);
}

export default function Game(props) {

    // Refs
    const canvasRef = useRef();
    const rendererRef = useRef();
    const engineRef = useRef();

    // States
    const [gl, setGL] = useState(null);

    useEffect(() => {
        document.title = props.name;

        // set canvas size
        canvasRef.current.width = props.width;
        canvasRef.current.height = props.height;

        const context = canvasRef.current.getContext('webgl2');
        setGL(context);

        // initialize webgl
        context.viewport(0, 0, props.width, props.height);

        // initialize renderer
        rendererRef.current = new Renderer(context);

        // initialize engine
        engineRef.current = new Engine();

    }, [props.name, props.height, props.width, gl]);

    return (
        <RendererContext.Provider value={rendererRef.current}>
            <GLContext.Provider value={gl}>
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                    }}>
                    <div style={{ width: '100%', height: '100%' }}>
                        <canvas ref={canvasRef} style={{ display: 'block' }}/>
                        { gl && rendererRef.current && props.children }
                    </div>
                </div>
            </GLContext.Provider>
        </RendererContext.Provider>
    );
}