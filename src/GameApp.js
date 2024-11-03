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

export default function App() {
    return (
        <Game name="Development" width={800} height={600}>
            <Scene>
                <GameObject name="Camera">
                    <Transform position={[0, 0, 0]}/>
                    <OrthographicCamera/>   
                    <Script import={import('./scripts/OrthographicCameraController')}/>
                    <Text>HELLO, WORLD</Text>
                </GameObject>
                {/* <GameObject name="Square">
                    <Transform position={[0, 3, 0]} scale={[0.5, 0.5, 1]}/>
                    <Circle/>
                    <CircleBody2D isStatic gravityScale={0}/>
                </GameObject> */}
                <GameObject>
                    <Transform/>
                    <Sprite/>
                    <BoxBody2D isStatic={false} gravityScale={0}/>
                    <Script import={import('./scripts/MovementScript')} speed={0.1}/>
                    <Text color={Color.red}>IM MOVING</Text>
                </GameObject>
            </Scene>
        </Game>
    );
}
