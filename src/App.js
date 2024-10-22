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

export default function App() {
    return (
        <Game name="Development" width={800} height={600}>
            <Scene>
                <GameObject name="Camera">
                    <Transform position={[0, 0, 10]}/>
                    <PerspectiveCamera/>   
                    <Script src="PerspectiveCameraController.js"/>
                </GameObject>
                <GameObject name="Square">
                    <Transform position={[0, 3, 0]} scale={[5, -5, 5]}/>
                    <Mesh objSrc="book.obj"/>
                </GameObject>
                <GameObject>
                    <Transform/>
                    <Sprite src="defaultShapes/circle.png"/>
                    {/* <Animator startAnim="DinoIdle">
                        <Animation name="DinoIdle" src="Dino.png" firstFrame={0} frames={4} length={0.5} cellWidth={24} cellHeight={24}/>
                    </Animator> */}
                </GameObject>
            </Scene>
        </Game>
    )
}