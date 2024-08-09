import Game from "./components/Game"
import Camera from "./components/Camera"
import Triangle from "./components/Triangle"

export default function App() {
    return (
        <Game name={"Game"} width={300} height={300}>
            <Camera bgColor={[1, 0, 1, 1]} />
            <Triangle />
        </Game>
    )
}