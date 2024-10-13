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
                    <Transform position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]}/>
                    <Sprite src="shapes/circle.png"/>
                    <Body2D/>
                    <Audio src="ah.wav"/>
                    <Script src="test.js"/>
                </GameObject>
                <GameObject>
                    <Transform position={[2, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]}/>
                    <Sprite src="shapes/circle.png"/>
                    <Body2D/>
                </GameObject>
            </Scene>
        </Game>
    )
}