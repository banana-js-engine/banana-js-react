"use strict";

var _jsxRuntime = require("react/jsx-runtime");
const React = require('react');
const ReactDOM = require('react-dom/client');
const App = require('./GameApp');
window.addEventListener('DOMContentLoaded', () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(/*#__PURE__*/(0, _jsxRuntime.jsx)(App.default, {})); // Render the App component
});