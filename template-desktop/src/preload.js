const React = require('react');
const ReactDOM = require('react-dom/client');
const App = require('./GameApp');

window.addEventListener('DOMContentLoaded', () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App.default />);  // Render the App component
});
