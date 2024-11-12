import { GameObject, Transform, Mesh, Script } from '@mfkucuk/banana-js';

export function Banana() {
    return (
        <GameObject name="Banana">
            <Transform scale={[1, -1, 1]}/>
            <Mesh objSrc="defaultModels/Banana.obj" mtlSrc="defaultModels/Banana.mtl"/>
            <Script import={import('../scripts/RotateScript')} speed={100}/>   
        </GameObject>
    );
} 