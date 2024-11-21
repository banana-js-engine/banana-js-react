import { useGameObject } from './GameObject';
import { CameraComponent } from '../ecs/Component';
import { ComponentType } from '../core/Types';

/**
 * React component camera (perspective):
 * Every scene has to have a camera in order for the player to see 
 * the rendered objects.
 * @param {{ bgColor: [number, number, number, number] 
 *           fovy: number
 *           near: number 
 *           far: number }} props 
 * @returns 
 */
export function PerspectiveCamera(props) {

    const gameObject = useGameObject();

    if (!gameObject.hasComponent(ComponentType.Camera)) {
        gameObject.addComponent(new CameraComponent(
            gameObject,
            false, 
            props.near, 
            props.far
        ));
    }

    useEffect(() => {
        const camera = gameObject.getComponent(ComponentType.Camera);
        camera.size = props.size ? props.size : 45;
        camera.clearColor = props.bgColor ? props.bgColor : [0.345, 0.588, 0.809, 1];
        camera.setPerspective();
    }, [props.size, props.bgColor]);
}