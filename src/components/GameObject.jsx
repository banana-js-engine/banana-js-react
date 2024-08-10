import { useEffect } from "react";

export default function GameObject(props) {

    const scene = useScene();

    useEffect(() => {
        scene.add(this);
    }, []);

}