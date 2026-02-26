import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'


import Echo from 'laravel-echo';
import Pusher from 'pusher-js';


window.Pusher = Pusher;
// Configuracion de echo
window.Echo = new Echo({
    broadcaster: 'reverb',
    key: 'my-app-key',   
    wsHost: window.location.hostname,
    wsPort: 8080,
    forceTLS: false, 
    disableStats: true, 
    enabledTransports: ['ws'], 
});

console.log("📡 Conectando con clave 'my-app-key' al puerto 8080...");

// 3. Arrancamos la App
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)