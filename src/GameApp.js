import Game from "./components/Game";
import GameObject from "./components/GameObject";
import Mesh from "./components/Mesh";
import OrthographicCamera from "./components/OrthographicCamera";
import Scene from "./components/Scene";
import Sprite from "./components/Sprite";
import Transform from "./components/Transform";
import Animator from "./components/Animator";
import Animation from "./components/Animation";
import Script from "./components/Script";
import PerspectiveCamera from "./components/PerspectiveCamera"
import Body2D from "./components/Body2D";
import { ShapeType } from "./core/Types";

export default function App() {
    return (
        <Game name="Development" width={800} height={600}>
            <Scene>
                <GameObject name="Camera">
                    <Transform position={[0, 0, 0]}/>
                    <OrthographicCamera/>   
                    <Script import={import('./scripts/OrthographicCameraController')}/>
                </GameObject>
                <GameObject name="Square">
                    <Transform position={[0, 3, 0]}/>
                    <Sprite src="defaultShapes/circle.png"/>
                    <Body2D shape={ShapeType.Circle} isStatic={false} gravityScale={0}/>

                    <Script>
                        {`
                            function ready() {
                                console.log('Hello, world!');
                            }
                        `}
                    </Script>
                </GameObject>
                <GameObject>
                    <Transform/>
                    <Sprite/>
                    <Animator startAnim="DinoIdle">
                        <Animation name="DinoIdle" src="Dino.png" firstFrame={0} frames={4} length={0.5} cellWidth={24} cellHeight={24}/>
                    </Animator>
                    <Body2D shape={ShapeType.Box} isStatic={false} gravityScale={0}/>
                    <Script import={import('./scripts/MovementScript')}/>
                </GameObject>
            </Scene>
        </Game>
    )
}