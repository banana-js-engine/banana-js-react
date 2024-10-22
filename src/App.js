import Game from "./components/Game";
import GameObject from "./components/GameObject";
import OrthographicCamera from "./components/OrthographicCamera";
import Scene from "./components/Scene";
import Sprite from "./components/Sprite";
import Transform from "./components/Transform";

export default function App() {
    return (
        <Game name="Development" width={800} height={600}>
            <Scene>
                <GameObject name="Camera">
                    <Transform/>
                    <OrthographicCamera/>   
                </GameObject>
                <GameObject name="Square">
                    <Transform/>
                    <Sprite color={[0, 1, 0, 1]}/>
                </GameObject>
            </Scene>
        </Game>
    )
}