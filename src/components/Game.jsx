import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Renderer } from '../renderer/Renderer';
import { Engine } from '../core/Engine';

// canvas context
const CanvasContext = createContext(null);

export function useCanvas() {
    return useContext(CanvasContext);
}

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
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        document.title = props.name;

        // set canvas size
        canvasRef.current.width = props.width;
        canvasRef.current.height = props.height;
        canvasRef.current.addEventListener('contextmenu', event => {
            event.preventDefault();
        });

        const context = canvasRef.current.getContext('webgl2', { antialias: false });
        setGL(context);

        // initialize webgl
        context.viewport(0, 0, props.width, props.height);

        // initialize renderer
        rendererRef.current = new Renderer(context);

        // initialize engine
        engineRef.current = new Engine(rendererRef.current);
        audioRef.current = new AudioContext();

        // Set initialized to true
        setInitialized(true);

    }, []);

    return (
        <CanvasContext.Provider value={canvasRef.current}>
            <EngineContext.Provider value={engineRef.current}>
                <RendererContext.Provider value={rendererRef.current}>
                    <GLContext.Provider value={gl}>
                        <AudioContextContext.Provider value={audioRef.current}>
                            <div style={{ userSelect: 'none', position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' }}>
                                <canvas
                                    id='banana-canvas'
                                    ref={canvasRef}
                                    style={{ outlineStyle: 'none' }}
                                    tabIndex={1}
                                >
                                    {initialized && props.children}
                                </canvas>
                            </div>
                        </AudioContextContext.Provider>
                    </GLContext.Provider>
                </RendererContext.Provider>
            </EngineContext.Provider>
        </CanvasContext.Provider>
    );
}