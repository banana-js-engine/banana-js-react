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
### <Transform/>