#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const fse = require('fs-extra'); // 'fs-extra' makes file copying easy
const pkg = require('../package.json');

// Function to create a new project directory and files
const createProject = (projectName) => {
    const projectPath = path.join(process.cwd(), projectName);
  
    if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath);
        console.log(`Creating project at ${projectPath}`);

        const packageJson = {
            name: projectName,
            version: "1.0.0",
            main: "src/index.js", // or whatever your main file is
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
                "@mfkucuk/banana-js": pkg.version
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

        fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));

        // Copy template files from the `templates` directory
        const templateDir = path.join(__dirname, '../template');
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
  
// Function to link the local main package (if needed)
const linkLocalPackage = (projectPath, packageName) => {
    console.log(`Linking local package ${packageName}...`);
    try {
        execSync(`npm link ${packageName}`, { cwd: projectPath, stdio: 'inherit' });
        console.log(`Linked ${packageName} successfully.`);
    } catch (err) {
        console.error(`Error linking package ${packageName}:`, err);
    }
};
  
// Get project name from command-line arguments
console.log('Fetching project name...');

const args = process.argv.slice(2);
const projectName = args[0];  // This fetches 'sandbox'

if (!projectName) {
    console.error('Please provide a project name.');
    process.exit(1);
}
createProject(projectName);
