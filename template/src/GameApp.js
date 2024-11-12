import { Game, Scene, GameObject, Transform, OrthographicCamera, Mesh, Script } from '@mfkucuk/banana-js';
import { Banana } from './prefabs/Banana';

export default function GameApp() {
    return (
        <Game name='banana-js game' width={800} height={600}>
            <Scene>
                <GameObject name="Camera">
                    <Transform/>
                    <OrthographicCamera/>
                    <Script import={import('./scripts/HelloWorldScript')}/>   
                </GameObject>

                <Banana/>
            </Scene>
        </Game>
    )
}