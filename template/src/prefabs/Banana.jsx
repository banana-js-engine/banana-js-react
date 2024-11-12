export function Banana() {
    return (
        <GameObject name="Banana">
            <Transform/>
            <Mesh objSrc="defaultModels/Banana.obj" mtlSrc="defaultModels/Banana.mtl"/>
            <Script import={import('../scripts/RotateScript')} speed={100}/>   
        </GameObject>
    );
} 