import { Game, Scene, GameObject, Transform, OrthographicCamera, Sprite, Script } from '@mfkucuk/banana-js';

export default function App() {
    return (
        <Game name='banana-js game' width={800} height={600}>
            <Scene>
                <GameObject name="Camera">
                    <Transform/>
                    <OrthographicCamera/>   
                </GameObject>
                <GameObject name="Square">
                    <Transform/>
                    <Sprite/>
                    <Script src="HelloWorldScript.js"/>
                </GameObject>
            </Scene>
        </Game>
    )
}