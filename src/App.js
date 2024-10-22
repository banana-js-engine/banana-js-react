import Game from "./components/Game";
import GameObject from "./components/GameObject";
import Mesh from "./components/Mesh";
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
                    <Mesh objSrc="defaultModels/Chair.obj" mtlSrc="defaultModels/Chair.mtl"/>
                </GameObject>
            </Scene>
        </Game>
    )
}