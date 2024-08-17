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

// engine context
const EngineContext = createContext(null);

export function useEngine() {
    return useContext(EngineContext);
}

// audio context
const AudioContextContext = createContext(null);

export function useAudioContext() {
    return useContext(AudioContextContext);
}

export default function Game(props) {

    // Refs
    const canvasRef = useRef();
    const rendererRef = useRef();
    const engineRef = useRef();
    const audioRef = useRef();

    // States
    const [gl, setGL] = useState(null);

    const isInitialized = function() {
        return gl && rendererRef.current && engineRef.current && audioRef.current;
    }

    useEffect(() => {
        document.title = props.name;

        // set canvas size
        canvasRef.current.width = props.width;
        canvasRef.current.height = props.height;

        const context = canvasRef.current.getContext('webgl2', { antialias: false });
        setGL(context);

        // initialize webgl
        context.viewport(0, 0, props.width, props.height);

        // initialize renderer
        rendererRef.current = new Renderer(context);

        // initialize engine
        engineRef.current = new Engine(rendererRef.current);

        audioRef.current = new AudioContext();

    }, []);

    

    return (
        <EngineContext.Provider value={engineRef.current}>
            <RendererContext.Provider value={rendererRef.current}>
                <GLContext.Provider value={gl}>
                    <AudioContextContext.Provider value={audioRef.current}>
                        <div
                            style={{
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                                overflow: 'hidden',
                            }}>
                            <div style={{ width: '100%', height: '100%' }}>
                                <canvas id='banana-canvas' ref={canvasRef} style={{ display: 'block' }} tabIndex={1}>
                                    { isInitialized() && props.children }
                                </canvas>
                            </div>
                        </div>
                    </AudioContextContext.Provider>
                </GLContext.Provider>
            </RendererContext.Provider>
        </EngineContext.Provider>
    );
}