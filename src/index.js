export { default as Animation }  from './components/Animation';
export { default as Animator }  from './components/Animator';
export { default as Audio }  from './components/Audio';
export { default as Body2D }  from './components/Body2D';
export { default as Cursor }  from './components/Cursor';
export { default as Game } from './components/Game';
export { default as GameObject } from './components/GameObject';
export { default as Mesh } from './components/Mesh';
export { default as OrthographicCamera } from './components/OrthographicCamera';
export { default as PerspectiveCamera } from './components/PerspectiveCamera';
export { default as Scene } from './components/Scene';
export { default as Script } from './components/Script';
export { default as Sprite } from './components/Sprite';
export { default as Transform } from './components/Transform';

export { Input } from './core/Input';
export { ComponentType, ShapeType } from './core/Types';

export { SceneManager } from './ecs/SceneManager';

export { BananaMath } from './math/BananaMath';
export { Matrix4 } from './math/Matrix';
export { Vector2, Vector3, Vector4 } from './math/Vector';

export { Color } from './renderer/Color';


const App = require('./App');
require('react-dom/client').createRoot(document.getElementById('root')).render(<App.default/>);

