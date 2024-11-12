import { Game, Scene, GameObject, Transform, Light, OrthographicCamera, Script, PlatformType } from '@mfkucuk/banana-js';
import { Banana } from './prefabs/Banana';

export default function GameApp() {
    return (
        <Game name='banana-js game' width={800} height={600} platform={PlatformType.Web}>
            <Scene>
                <GameObject name="Camera">
                    <Transform/>
                    <Light/>
                    <OrthographicCamera/>
                    <Script import={import('./scripts/HelloWorldScript')}/>   
                </GameObject>

                <Banana/>
            </Scene>
        </Game>
    )
}