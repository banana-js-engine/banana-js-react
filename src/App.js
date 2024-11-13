import GameApp from "./GameApp";

export default function App() {
    return (
        <div style={{
            maxWidth: 'fit-content',
            margin: 'auto'
        }}>
            <div>
                <h1 style={{ textAlign: 'center' }}>BANANA.JS PLAYGROUND</h1>
            </div>
            <GameApp/>
        </div>
    )
}