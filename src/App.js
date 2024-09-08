import Game from "./components/Game"
import GameObject from "./components/GameObject"
import Scene from "./components/Scene"
import Sprite from "./components/Sprite"
import Transform from "./components/Transform"
import OrthographicCamera from "./components/OrthographicCamera"
import Script from "./components/Script"
import Audio from "./components/Audio"
import Cursor from "./components/Cursor"

export default function App() {
    return (
        <Game name='Game' width={800} height={600}>
            <Cursor src="target_a.svg" size={100}/>
            <Scene>
                <GameObject>
                    <Transform position={[0, 0, 0]} rotation={[0, 0, 0]}/>
                    <OrthographicCamera/>   
                    {/* <Audio src="testAudio.mp3" playOnStart={true} /> */}
                </GameObject>
                <GameObject>
                    <Transform position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[2, 2, 1]}/>
                    <Sprite src="kitsune-umi.png"/>
                    <Script src="test.js"/>
                    {/* <Audio src="ah.wav"/> */}
                </GameObject>
            </Scene>
        </Game>
    )
}