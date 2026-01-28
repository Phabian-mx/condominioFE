import { useState } from 'react';

// --- TUS COMPONENTES VISUALES (DISEÑO) ---
import Portada from "./componentes/Portada";
import BarraNavegacion from "./componentes/BarraNavegacion";

// --- TUS COMPONENTES FUNCIONALES (LÓGICA SUPABASE) ---
import Login from "./componentes/Login";  // Este tiene la conexión real
import Panel from "./componentes/Panel";  // Este (antes Dashboard) muestra los datos

function App() {
  // 1. Datos del usuario (si es null, no ha entrado)
  const [usuario, setUsuario] = useState(null);
  
  // 2. Controlar si mostramos la ventanita de Login
  const [mostrarLogin, setMostrarLogin] = useState(false);

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      
      {/* --- NIVEL 1: NAVEGACIÓN (Siempre visible) --- */}
      <BarraNavegacion 
        alClickLogin={() => setMostrarLogin(true)} 
        alClickInicio={() => setUsuario(null)} 
      />
      
      {/* --- NIVEL 2: FONDO (La imagen bonita) --- */}
      <Portada />

      {/* --- NIVEL 3: MODAL DE LOGIN (Solo si se activa el botón) --- */}
      {mostrarLogin && !usuario && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative">
            {/* Botón para cerrar la ventana si te arrepientes */}
            <button 
              onClick={() => setMostrarLogin(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold"
            >
              ✕
            </button>
            
            {/* Aquí cargamos tu componente Login conectado a Supabase */}
            <Login onLogin={(datos) => {
              setUsuario(datos);      // Guardamos al usuario
              setMostrarLogin(false); // Cerramos la ventana
            }} />
          </div>
        </div>
      )}

      {/* --- NIVEL 4: EL PANEL (Si el usuario ya entró) --- */}
      {usuario && (
        <div className="fixed inset-0 z-[200] bg-gray-100 overflow-auto">
           {/* Le pasamos el usuario al Panel para que diga "Hola Admin" */}
           <Panel usuario={usuario} />
        </div>
      )}

    </main>
  );
}

export default App;