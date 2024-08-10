import { useEffect } from 'react';
import { useRenderer } from './Game';

export default function Triangle() {

    const renderer = useRenderer();

    useEffect(() => {
        // renderer.drawTriangle();
    }, [renderer]);

    return null;
}