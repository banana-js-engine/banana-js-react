import Game from "./Game"
import Test from "./Test"
import Triangle from "./Triangle"

export default function App() {
    return (
        <Game name={"Game"} width={300} height={300}>
            <Test/>
            <Triangle/>
        </Game>
    )
}