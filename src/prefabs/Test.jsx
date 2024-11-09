import { BoxBody2D } from "../components/BoxBody2D";
import { GameObject } from "../components/GameObject";
import { Script } from "../components/Script";
import { Sprite } from "../components/Sprite";
import { Transform } from "../components/Transform";
import { Color } from "../renderer/Color";

export function Test() {

    return (
        <GameObject>
            <Transform/>
            <Sprite color={Color.red}/>
            <BoxBody2D isStatic={false} gravityScale={0}/>
            <Script import={import('../scripts/RotateScript')}/>
        </GameObject>
    );
}