import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Renderer } from '../renderer/Renderer';
import { Engine } from '../core/Engine';
import { TextRenderer } from '../renderer/TextRenderer';

// gl context
const GLContext = createContext(null);

export function useGL() {
    return useContext(GLContext);
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

export function Game(props) {
    // Refs
    const engineRef = useRef();
    const audioRef = useRef();

    // States
    const [gl, setGL] = useState(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        document.title = props.name;

        // set canvas size
        const canvas = document.getElementById('banana-canvas');
        canvas.width = props.width;
        canvas.height = props.height;
        canvas.addEventListener('contextmenu', event => {
            event.preventDefault();
        });

        const context = canvas.getContext('webgl2', { antialias: false });
        setGL(context);

        // initialize webgl
        context.viewport(0, 0, props.width, props.height);

        // 2d context
        const textCanvas = document.getElementById('banana-text');
        textCanvas.width = props.width;
        textCanvas.height = props.height;
        const ctx = textCanvas.getContext('2d');

        // initialize renderer(s)
        const renderer = new Renderer(context);
        const textRenderer = new TextRenderer(ctx);

        // initialize engine
        engineRef.current = new Engine(renderer, textRenderer);
        audioRef.current = new AudioContext();

        // Set initialized to true
        setInitialized(true);

    }, []);

    const onClick = function() {
        document.getElementById('banana-canvas').focus();
    } 

    return (
        <EngineContext.Provider value={engineRef.current}>
            <GLContext.Provider value={gl}>
                <AudioContextContext.Provider value={audioRef.current}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: props.width, height: props.height }}
                        onClick={onClick}>
                        
                        <canvas 
                            id='banana-text'
                            style={{ position: 'absolute', top: 0, left: 0, outlineStyle: 'none' }}
                            tabIndex={-1}>
                        </canvas>
                        <canvas
                            id='banana-canvas'
                            style={{ userSelect: 'none', WebkitUserSelect: 'none', outlineStyle: 'none' }}
                            tabIndex={1}>
                            {initialized && props.children}
                        </canvas>
                    </div>
                </AudioContextContext.Provider>
            </GLContext.Provider>
        </EngineContext.Provider>
    );
}