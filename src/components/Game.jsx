import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Renderer } from '../renderer/Renderer';
import { Engine } from '../core/Engine';
import { TextRenderer } from '../renderer/TextRenderer';
import { PlatformType } from '../core/Types';

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

/**
 * 
 * @param {{ name, width, height, platform }} props 
 * @returns 
 */
export function Game(props) {
    // Refs
    const engineRef = useRef();
    const audioRef = useRef();

    // States
    const [gl, setGL] = useState(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        document.title = props.name;

        let width = window.innerWidth;
        let height = window.innerHeight;
        if (width / height > props.width / props.height) {
            width = height * (props.width / props.height);
        } else {
            height = width / (props.width / props.height);
        }

        width = props.platform == PlatformType.Itchio ? width : props.width;
        height = props.platform == PlatformType.Itchio ? height : props.height;

        // set canvas size
        const canvas = document.getElementById('banana-canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.addEventListener('contextmenu', event => {
            event.preventDefault();
        });

        const context = canvas.getContext('webgl2', { antialias: false });
        setGL(context);

        // initialize webgl
        context.viewport(0, 0, width, height);

        // 2d context
        const textCanvas = document.getElementById('banana-text');
        textCanvas.width = width;
        textCanvas.height = height;
        textCanvas.addEventListener('contextmenu', event => {
            event.preventDefault();
        });

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

    const onMouseDown = function(event) {
        event.preventDefault();
        engineRef.current.running = true;
        document.getElementById('banana-canvas').focus();
    } 
    
    const onBlur = function(event) {
        event.preventDefault();
        engineRef.current.running = false;
        document.getElementById('banana-canvas').blur();
    }

    const onTouchStart = function(event) {
        event.preventDefault();
        engineRef.current.running = true;
        document.getElementById('banana-canvas').focus();
    }

    const divStyle = props.platform == PlatformType.Itchio ? {
        position: 'absolute',
        top: 0,
        left: 0,
        width: props.width,
        height: props.height
    } : {
        position: 'relative', 
        width: props.width, 
        height: props.height
    }

    return (
        <EngineContext.Provider value={engineRef.current}>
            <GLContext.Provider value={gl}>
                <AudioContextContext.Provider value={audioRef.current}>
                    <div 
                        id="banana-container" 
                        style={divStyle}
                        onMouseDown={onMouseDown}
                        onBlur={onBlur}
                        onTouchStart={onTouchStart}
                    >
                        <canvas
                            id="banana-canvas"
                            style={{ position: 'absolute', top: 0, left: 0, userSelect: 'none', outline: 'none' }}
                            tabIndex={1}
                        >
                            {initialized && props.children}
                        </canvas>
                        <canvas
                            id="banana-text"
                            style={{ position: 'absolute', top: 0, left: 0, outline: 'none', pointerEvents: 'none' }}
                            tabIndex={-1}
                        />
                    </div>
                </AudioContextContext.Provider>
            </GLContext.Provider>
        </EngineContext.Provider>
    );
}