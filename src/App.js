import Game from "./components/Game"
import GameObject from "./components/GameObject"
import Scene from "./components/Scene"
import Sprite from "./components/Sprite"
import Transform from "./components/Transform"
import OrthographicCamera from "./components/OrthographicCamera"
import Script from "./components/Script"
import Audio from "./components/Audio"
import Cursor from "./components/Cursor"
import Body2D from "./components/Body2D"
import Animator from "./components/Animator"
import Animation from "./components/Animation"
import { ShapeType } from "./core/Types"
import { Color } from "./renderer/Color"
import PerspectiveCamera from "./components/PerspectiveCamera"

export default function App() {
    return (
        <Game name='Game' width={800} height={600}>
            <Cursor src="tool_sword_a.svg" size={100}/>
            <Scene>
                <GameObject name="Camera">
                    <Transform position={[0, 0, 0]} rotation={[0, 0, 0]}/>
                    <OrthographicCamera/>   
                    {/* <Audio src="testAudio.mp3" playOnStart={true} /> */}
                </GameObject>
                <GameObject name="Circle">
                    <Transform position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]}/>
                    <Sprite src="shapes/circle.png"/>
                    <Body2D shape={ShapeType.Box}/>
                    <Audio src="ah.wav"/>
                    <Script src="test.js"/>

                    <Animator>
                        <Animation src="Dino.png" name="DinoIdle" cellWidth={24} cellHeight={24} length={0.5} frames={4} firstFrame={0}/>
                        <Animation src="Dino.png" name="DinoRun" cellWidth={24} cellHeight={24} length={0.5} frames={6} firstFrame={4}/>
                    </Animator>
                </GameObject>
                <GameObject>
                    <Transform position={[2, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]}/>
                    <Sprite src="shapes/circle.png"/>
                    <Body2D shape={ShapeType.Box}/>

                    <Animator startAnim="DinoIdle">
                        <Animation src="Dino.png" name="DinoIdle" cellWidth={24} cellHeight={24} length={0.5} frames={4} firstFrame={0}/>
                    </Animator>
                </GameObject>

                <GameObject>
                    <Transform position={[1, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]}/>
                    <Sprite src="shapes/circle.png"/>
                    <Body2D shape={ShapeType.Box}/>

                    <Animator startAnim="DinoIdle">
                        <Animation src="Dino.png" name="DinoIdle" cellWidth={24} cellHeight={24} length={0.5} frames={4} firstFrame={0}/>
                    </Animator>
                </GameObject>
            </Scene>

            <Scene>
                <GameObject name="Camera">
                    <Transform position={[0, 0, 0]} rotation={[0, 0, 0]}/>
                    <OrthographicCamera bgColor={Color.orange}/>   
                    {/* <Audio src="testAudio.mp3" playOnStart={true} /> */}
                </GameObject>
                <GameObject name="Circle">
                    <Transform position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]}/>
                    <Sprite src="shapes/circle.png"/>
                    <Body2D shape={ShapeType.Circle}/>
                    <Audio src="ah.wav"/>
                    <Script src="test.js"/>

                    <Animator>
                        <Animation src="Dino.png" name="DinoIdle" cellWidth={24} cellHeight={24} length={0.5} frames={4} firstFrame={0}/>
                        <Animation src="Dino.png" name="DinoRun" cellWidth={24} cellHeight={24} length={0.5} frames={6} firstFrame={4}/>
                    </Animator>
                </GameObject>
            </Scene>
        </Game>
    )
}