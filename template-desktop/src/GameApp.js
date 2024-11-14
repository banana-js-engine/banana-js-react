import { Game, Scene, GameObject, Transform, Light, OrthographicCamera, Script, PlatformType } from '@mfkucuk/banana-js';
import { Banana } from './prefabs/Banana';

export default function GameApp() {
    return (
        <Game name='banana-js game' width={800} height={600} platform={PlatformType.Desktop}>
            <Scene>
                <GameObject name="Camera">
                    <Transform/>
                    <OrthographicCamera/>
                    <Script import={import('./scripts/HelloWorldScript')}/>   
                </GameObject>

                <GameObject name="Light">
                    <Transform position={[1, -1, 1]}/>
                    <Light/>
                </GameObject>

                <Banana/>
            </Scene>
        </Game>
    )
}