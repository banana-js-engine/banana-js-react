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
import { Tilemap } from "./components/Tilemap";
import { Animator } from "./components/Animator";
import { Animation } from "./components/Animation";
import { Dialogue } from "./components/Dialogue";
import { DebugSettings } from "./components/DebugSettings";
import { Audio } from "./components/Audio";
import { Timer } from "./components/Timer";
import { UIButton } from "./components/UIButton";

export default function GameApp() {
    const [count, setCount] = useState(0);

    const incrementCount = () => {
        setCount(prevCount => prevCount + 1);    
    };
    
    return (
        <Game name="Development" width={800} height={400} platform={PlatformType.Web}>
            <DebugSettings showFps showCollisionShapes/>
            <Scene>
                <GameObject name="Camera">
                    <Transform position={[0, 0, 0]}/>
                    <OrthographicCamera bgColor={[0, 0, 0, 1]}/>   
                    <Script import={import('./scripts/OrthographicCameraController')}/>
                </GameObject>
                {/* <GameObject name="Square">
                    <Transform/>
                    <Sprite color={Color.orange}/>
                </GameObject> */}
                {/* <GameObject name="Book">
                    <Transform position={[0, 0, 0]} scale={[1, -1, 1]}/>
                    <Mesh objSrc="defaultModels/Banana.obj" mtlSrc="defaultModels/Banana.mtl"/>
                    <Script import={import('./scripts/RotateScript')} speed={100}/>
                </GameObject> */}

                <GameObject>
                    <UIButton x={40} y={40} width={100} height={40}>PRESS</UIButton>
                </GameObject>

                <GameObject>
                    <UIButton x={200} y={40} width={60} height={40}>PRESS</UIButton>
                </GameObject>

                <GameObject>
                    <Transform position={[-4, -4, 0]}/>
                    <Tilemap src="dungeon.png" dataSrc="tilemap.data" cellWidth={13} cellHeight={13}/>
                </GameObject>

                <GameObject>
                    <Transform position={[-1, 1, 1]}/>
                    <Sprite/>
                    <BoxBody2D isStatic/>

                    <Animator startAnim="Idle">
                        <Animation src="Dino.png" name="Idle" firstFrame={0} frames={4} cellHeight={24} cellWidth={24} length={0.6}/>
                    </Animator>
                </GameObject>

                <GameObject>
                    <Transform position={[0, 0, 1]} rotation={[0, 0, 0]} scale={[1, 1, 1]}/>
                    <Sprite/>
                    <Audio src="Track01.wav" playOnStart loop volume={0.1}/>
                    <Timer/>
                    <BoxBody2D isStatic/>

                    <Animator startAnim="Idle">
                        <Animation src="dungeon.png" name="Idle" firstFrame={27} frames={0} cellWidth={13} cellHeight={13}/>
                    </Animator>

                    <Script import={import('./scripts/MovementScript')} speed={0.1} test={incrementCount}/>

                    <GameObject>
                        <Transform position={[1, 0, 0]} rotation={[0, 0, 45]}/>
                        <Sprite/>

                        <GameObject>
                            <Transform position={[2, 0, 0]} rotation={[0, 0, 30]}/>
                            <Sprite/>
                        </GameObject>
                    </GameObject>
                </GameObject>

                <GameObject name="Particle">
                    <Transform position={[2.1, -1.3, 2]}/>
                    <Particle color={Color.red} count={10} minAge={0.3} maxAge={0.5}/>
                </GameObject>

                <GameObject name="Light">
                    <Transform position={[2.1, -1.3, 0]}/>
                    <Light intensity={4}/>
                </GameObject>

                <GameObject name="Particle">
                    <Transform position={[-1.9, 1.8, 2]}/>
                    <Particle color={Color.red} count={10} minAge={0.3} maxAge={0.5}/>
                </GameObject>

                <GameObject name="Light">
                    <Transform position={[-1.9, 1.8, 0]}/>
                    <Light intensity={4}/>
                </GameObject>

                <GameObject>
                    <Transform position={[0, 4, 0]}/>
                    <Dialogue color={[1, 1, 1, 1]} fontSize={20} playOnStart>
                        <div>Got the dialogue system working</div>
                    </Dialogue>
                </GameObject>

                <GameObject>
                    <UIText x={100} y={100}>{count}</UIText>
                </GameObject>
            </Scene>
        </Game>
    );
}