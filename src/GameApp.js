import { Game } from "./components/Game";
import { GameObject } from "./components/GameObject";
import { OrthographicCamera } from "./components/OrthographicCamera";
import { Scene } from "./components/Scene";
import { Sprite } from "./components/Sprite";
import { Circle } from "./components/Circle";
import { Transform } from "./components/Transform";
import { Script } from "./components/Script";
import { Text } from "./components/Text";
import { BoxBody2D } from "./components/BoxBody2D";
import { CircleBody2D } from "./components/CircleBody2D";
import { Color } from "./renderer/Color";
import { useState } from "react";
import { Cube } from "./components/Cube";
import { Mesh } from "./components/Mesh";
import { Light } from "./components/Light";
import { UIText } from "./components/UIText";
import { Particle } from "./components/Particle";
import { PlatformType } from "./core/Types";
import { Cursor } from "./components/Cursor";

export default function GameApp() {
    const [count, setCount] = useState(0);

    const incrementCount = () => {
        setCount(prevCount => prevCount + 1);    
    };
    
    return (
        <Game name="Development" width={600} height={600} platform={PlatformType.Web}>
            <Cursor/>
            <Scene>
                <GameObject name="Camera">
                    <Transform position={[0, 0, 0]}/>
                    <Light direction={[1, -1, 1]}/>
                    <OrthographicCamera/>   
                    <Script import={import('./scripts/OrthographicCameraController')}/>
                </GameObject>
                {/* <GameObject name="Square">
                    <Transform/>
                    <Sprite color={Color.orange}/>
                </GameObject> */}
                {/* <GameObject>
                    <Transform/>
                    <Cube/>
                    <BoxBody2D isStatic={false} gravityScale={0}/>
                    <Script import={import('./scripts/MovementScript')} speed={0.1} test={incrementCount}/>
                </GameObject> */}
                {/* <GameObject name="Book">
                    <Transform position={[0, 0, 0]} scale={[1, -1, 1]}/>
                    <Mesh objSrc="defaultModels/Banana.obj" mtlSrc="defaultModels/Banana.mtl"/>
                    <Script import={import('./scripts/RotateScript')} speed={100}/>
                </GameObject> */}

                <GameObject name="Particle">
                    <Transform position={[0, 0, 0]}/>
                    <Particle/>
                    <Script import={import('./scripts/ParticleScript')}/>
                </GameObject>
                
                {/* <GameObject name="Building">
                    <Transform scale={[1, -1, 1]}/>
                    <Mesh objSrc="TallBuilding01.obj" mtlSrc="TallBuilding01.mtl"/>
                    <Script import={import('./scripts/RotateScript')} speed={100}/>
                </GameObject> */}

                {/* <GameObject name="Chair">
                    <Transform scale={[1, -1, 1]}/>
                    <Mesh objSrc="Chair.obj" mtlSrc="Chair.mtl"/>
                    <Script import={import('./scripts/RotateScript')} speed={100}/>
                </GameObject> */}
            </Scene>
        </Game>
    );
}