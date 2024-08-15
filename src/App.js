import Game from "./components/Game"
import GameObject from "./components/GameObject"
import Scene from "./components/Scene"
import Sprite from "./components/Sprite"
import Transform from "./components/Transform"
import OrthographicCamera from "./components/OrthographicCamera"

export default function App() {
    return (
        <Game name='Game' width={800} height={600}>
            <Scene>
                <GameObject>
                    <Transform position={[0, 0, 0]} rotation={[0, 0, 0]}/>
                    <OrthographicCamera/>   
                </GameObject>
                <GameObject>
                    <Transform position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]}/>
                    <Sprite color={[0, 1, 0, 1]} src="logo192.png"/>
                </GameObject>
            </Scene>
        </Game>
    )
}