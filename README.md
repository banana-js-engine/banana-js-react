# 🍌 banana-js 🍌
## ⬇️ Installation
Download the npm package using: ```npm install -g @mfkucuk/banana-js``` <br />

## 🚀 Quick Start
```
create-bananajs-app <project_name>
cd <project_name>
npm start
```

This will create and start the template project, and will be greeted by this screen:
![alt text](ReadmeAssets/init.png)

## 📝 Template
- `index.js` is the entry point of your project which renders the < $${\color{lightblue}GameApp}$$ > component.<br/>
- `GameApp.js` contains the component that represent your game. You will mainly work with this component to define the structure of your game.
- `public/` directory contains assets like a React project, also use it for storing game assets (texture, audio, model, material). This folder will be the root folder for locating these type of files.
- `script/` directory contains your banana-js scripts. These are special JavaScript files whose lifetimes are handled by the engine.

# Reference
## Components
### < Transform />
Defines the orientation of the GameObject in the scene.
```jsx
<GameObject>
    <Transform/> /* position=[0, 0, 0,] rotation=[0, 0, 0] scale=[1, 1, 1] */
</GameObject>
```
Alternatively, you can pass in props to change the default values:
```jsx
<GameObject>
    <Transform position={[2, 1, 0]} rotation={[0, 0, 30]} scale={[0.5, 2, 1]}/>
    <Sprite/>
</GameObject>
```
![alt text](ReadmeAssets/transform.png)
