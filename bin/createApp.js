#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const fse = require('fs-extra'); // 'fs-extra' makes file copying easy

// Function to create a new project directory and files
const createWebProject = (projectName) => {
    const projectPath = path.join(process.cwd(), projectName);
  
    if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath);
        console.log(`Creating project at ${projectPath}`);

        const packageJsonWeb = {
            name: projectName,
            version: "1.0.0",
            main: "src/index.js", // or whatever your main file is
            homepage: ".",
            scripts: {
                start: "react-scripts start",
                build: "react-scripts build",
                test: "react-scripts test",
                eject: "react-scripts eject",
            },
            dependencies: {
                react: "^18.0.0", // replace with the desired version
                "react-dom": "^18.0.0", // replace with the desired version
                "react-scripts": "5.0.1",
                "@mfkucuk/banana-js": "latest"
            },
            "browserslist": {
              "production": [
                ">0.2%",
                "not dead",
                "not op_mini all"
              ],
              "development": [
                "last 1 chrome version",
                "last 1 firefox version",
                "last 1 safari version"
              ]
            }
        };        

        fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify(packageJsonWeb, null, 2));

        // Copy template files from the `templates` directory
        const templateDir = path.join(__dirname, '../template-web');
        fse.copySync(templateDir, projectPath);

        // Replace placeholders in specific files (e.g., App.js)
        const appJsPath = path.join(projectPath, 'src', 'GameApp.js');
        let appJsContent = fs.readFileSync(appJsPath, 'utf8');
        appJsContent = appJsContent.replace('{process.env.PROJECT_NAME}', projectName);
        fs.writeFileSync(appJsPath, appJsContent);

        // Install additional dependencies
        installPackages(projectPath, ['react', 'react-dom']);

        // Optionally link the local version of your main package
        // linkLocalPackage(projectPath, 'banana-js');
    } else {
        console.error(`Project ${projectName} already exists.`);
    }
};

// Function to create a new project directory and files
const createDesktopProject = (projectName) => {
    const projectPath = path.join(process.cwd(), projectName);
  
    if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath);
        console.log(`Creating project at ${projectPath}`);

        const packageJsonDesktop = {
            name: projectName,
            version: "1.0.0",
            main: "src/index.js",
            scripts: {
                start: "electron .",
                "build": "babel src --out-dir build",
                "package": "electron-packager . --out=dist --overwrite"
            },
            dependencies: {
                "@babel/cli": "^7.25.7",
                "@babel/core": "^7.25.8",
                "@babel/preset-env": "^7.25.8",
                "@babel/preset-react": "^7.25.7",
                react: "^18.0.0",
                "react-dom": "^18.0.0",
                "@mfkucuk/banana-js": "latest"
            },
            devDependencies: {
                "electron-packager": "^17.0.0",
                "electron": "^33.2.0"
            },
            "browserslist": {
              "production": [
                ">0.2%",
                "not dead",
                "not op_mini all"
              ],
              "development": [
                "last 1 chrome version",
                "last 1 firefox version",
                "last 1 safari version"
              ]
            }
        };
        

        fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify(packageJsonDesktop, null, 2));

        // Copy template files from the `templates` directory
        const templateDir = path.join(__dirname, '../template-desktop');
        fse.copySync(templateDir, projectPath);

        // Replace placeholders in specific files (e.g., App.js)
        const appJsPath = path.join(projectPath, 'src', 'GameApp.js');
        let appJsContent = fs.readFileSync(appJsPath, 'utf8');
        appJsContent = appJsContent.replace('{process.env.PROJECT_NAME}', projectName);
        fs.writeFileSync(appJsPath, appJsContent);

        // Install additional dependencies
        installPackages(projectPath, ['react', 'react-dom']);
    } else {
        console.error(`Project ${projectName} already exists.`);
    }
};
  
// Function to install npm packages
const installPackages = (projectPath, packages) => {
    console.log('Installing dependencies...');
    try {
        execSync(`npm install ${packages.join(' ')}`, { cwd: projectPath, stdio: 'inherit' });
        console.log('Dependencies installed successfully.');
    } catch (err) {
        console.error('Error installing dependencies:', err);
    }
};
  
// Get project name from command-line arguments
console.log('Fetching project name...');


const args = process.argv.slice(2);
const projectName = args[0];  // This fetches 'sandbox'

if (args.length == 1) {
    const projectName = args[0];  // This fetches 'sandbox'

    if (!projectName) {
        console.error('Please provide a project name.');
        process.exit(1);
    }
    createWebProject(projectName);
} else if (args.length == 2) {
    const flag = args[0];
    const projectName = args[1];

    if (flag == '--desktop') {
        createDesktopProject(projectName);
    } else if (flag == '--web') {
        createWebProject(projectName);
    } else {
        console.error('Unknown platform');
        process.exit(1);
    }
} else {
    console.error('Example usage: create-bananajs-app --desktop hello-world');
    process.exit(1);
}
