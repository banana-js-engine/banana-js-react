import Game from "./components/Game"
// import Camera from "./components/Camera"
import GameObject from "./components/GameObject"
import Scene from "./components/Scene"
import Transform from "./components/Transform"

export default function App() {
    return (
        <Game name={"Game"} width={300} height={300}>
            <Scene>
                <GameObject>
                    <Transform></Transform>
                </GameObject>
            </Scene>
        </Game>
    )
}