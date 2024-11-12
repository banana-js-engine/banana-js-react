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

export default function GameApp() {
    const [count, setCount] = useState(0);

    const incrementCount = () => {
        setCount(prevCount => prevCount + 1);    
    };
    
    return (
        <Game name="Development" width={600} height={600}>
            <Scene>
                <GameObject name="Camera">
                    <Transform position={[0, 0, 0]}/>
                    <Light direction={[1, -1, 1]}/>
                    <OrthographicCamera/>   
                    <Script import={import('./scripts/OrthographicCameraController')}/>
                </GameObject>

                <GameObject name="FPS UI">
                    <Transform position={[-4, -4, 0]}/>
                    <UIText x={20} y={30} fontSize={30} color={Color.white}>FPS: 60</UIText>
                    <Script import={import('./scripts/FPSScript')}/>
                </GameObject>
                {/* <GameObject name="Square">
                    <Transform/>
                    <Sprite color={Color.orange}/>
                </GameObject> */}
                <GameObject>
                    <Transform/>
                    <Sprite/>
                    <BoxBody2D isStatic={false} gravityScale={0}/>
                    <Script import={import('./scripts/MovementScript')} speed={0.1} test={incrementCount}/>
                    <Text color={Color.red}>{count}</Text>
                </GameObject>
                {/* <GameObject name="Book">
                    <Transform position={[0, 0, 0]} scale={[1, -1, 1]}/>
                    <Mesh objSrc="defaultModels/Banana.obj" mtlSrc="defaultModels/Banana.mtl"/>
                    <Script import={import('./scripts/RotateScript')} speed={100}/>
                </GameObject> */}

                <GameObject name="Particle">
                    <Transform position={[3, 0, 0]}/>
                    <Particle/>
                    <Script import={import('./scripts/ParticleScript')}/>
                </GameObject>

                <GameObject name="Particle">
                    <Transform position={[-1, 0, 0]}/>
                    <Particle/>
                </GameObject>
                
                <GameObject name="Book">
                    <Transform position={[0, 0, 0]} scale={[1, -1, 1]}/>
                    <Mesh objSrc="TallBuilding01.obj" mtlSrc="TallBuilding01.mtl"/>
                    <Script import={import('./scripts/RotateScript')} speed={100}/>
                </GameObject>
            </Scene>
        </Game>
    );
}
