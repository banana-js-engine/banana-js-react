export { Animation }  from './components/Animation';
export { Animator }  from './components/Animator';
export { Audio }  from './components/Audio';
export { BoxBody2D }  from './components/BoxBody2D';
export { Circle }  from './components/Circle';
export { CircleBody2D }  from './components/CircleBody2D';
export { Cube }  from './components/Cube';
export { Cursor }  from './components/Cursor';
export { Cylinder }  from './components/Cylinder';
export { Game } from './components/Game';
export { GameObject } from './components/GameObject';
export { Icosphere } from './components/Icosphere';
export { Light } from './components/Light';
export { Mesh } from './components/Mesh';
export { OrthographicCamera } from './components/OrthographicCamera';
export { Particle } from './components/Particle';
export { PerspectiveCamera } from './components/PerspectiveCamera';
export { Scene } from './components/Scene';
export { Script } from './components/Script';
export { Sphere } from './components/Sphere';
export { Sprite } from './components/Sprite';
export { Text } from './components/Text';
export { Torus } from './components/Torus';
export { Transform } from './components/Transform';
export { UIText } from './components/UIText';

export { Input } from './core/Input';
export *  from './core/Types';

export { ScriptComponent } from './ecs/Component';
export { SceneManager } from './ecs/SceneManager';

export * from './math/bananaMath';
export { Matrix4 } from './math/Matrix';
export { Vector2, Vector3, Vector4 } from './math/Vector';

export { Color } from './renderer/Color';

// const App = require('./GameApp');
// require('react-dom/client').createRoot(document.getElementById('root')).render(<App.default/>);

// electron.js
// const { app, BrowserWindow } = require('electron');
// const path = require('path');

// let mainWindow;

// function createWindow() {
//     mainWindow = new BrowserWindow({
//         width: 600,
//         height: 600,
//         webPreferences: {
//             preload: path.join(__dirname, 'preloader.js'),  // Preload script for renderer
//             contextIsolation: false,                       // Needed for using require in renderer
//             nodeIntegration: true,                         // Allow Node.js in renderer
//         },
//         autoHideMenuBar: true,
//         resizable: false,
//         roundedCorners: true,
//     });

//     const startURL = `file://${path.join(__dirname, '../public/index.html')}`;

//     mainWindow.loadURL(startURL);

//     mainWindow.on('closed', () => (mainWindow = null));
// }

// app.on('ready', createWindow);

// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//         app.quit();
//     }
// });

// app.on('activate', () => {
//     if (mainWindow === null) {
//         createWindow();
//     }
// });