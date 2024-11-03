import { Game } from "./components/Game";
import { GameObject } from "./components/GameObject";
import { Mesh } from "./components/Mesh";
import { OrthographicCamera } from "./components/OrthographicCamera";
import { Scene } from "./components/Scene";
import { Sprite } from "./components/Sprite";
import { Transform } from "./components/Transform";
import { Animator } from "./components/Animator";
import { Animation} from "./components/Animation";
import { Script } from "./components/Script";
import { Text } from "./components/Text";
import { PerspectiveCamera } from "./components/PerspectiveCamera"
import { Body2D } from "./components/Body2D";
import { ShapeType } from "./core/Types";
import { Cube } from "./components/Cube";
import { Circle } from "./components/Circle";
import { Color } from "./renderer/Color";
import { Icosphere } from "./components/Icosphere";
import { Sphere } from "./components/Sphere";
import { Cylinder } from "./components/Cylinder";
import { Torus } from "./components/Torus";

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
                <GameObject name="Square">
                    <Transform position={[0, 3, 0]}/>
                    <Sprite/>
                    <Body2D shape={ShapeType.Box} isStatic gravityScale={0}/>
                </GameObject>
                <GameObject>
                    <Transform/>
                    <Sprite/>
                    <Body2D shape={ShapeType.Box} isStatic={false} gravityScale={0}/>
                    <Script import={import('./scripts/MovementScript')} speed={0.1}/>
                    <Text color={Color.red}>IM MOVING</Text>
                </GameObject>
            </Scene>
        </Game>
    );
}
