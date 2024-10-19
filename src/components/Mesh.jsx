import { useEffect } from "react";
import { useGameObject } from "./GameObject";
import { useScene } from "./Scene";
import { MeshComponent } from "../ecs/Component";

export default function Mesh(props) {
    
    const ecs = useScene();
    const id = useGameObject();

    useEffect(() => {
        ecs.emplace(id, new MeshComponent(id, ecs));
    }, []);

}