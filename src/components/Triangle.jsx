import { useEffect } from 'react';
import { useRenderer } from './Game';

export default function Triangle(props) {

    const renderer = useRenderer();

    useEffect(() => {
        renderer.drawQuad(props.x, props.y);
        renderer.flush();
    }, [props.x, props.y, renderer]);

    return null;
}