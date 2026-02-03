import { useState } from 'react';

// --- COMPONENTES ---
import Portada from "./componentes/Portada";
import BarraNavegacion from "./componentes/BarraNavegacion";
import Login from "./componentes/Login";
import Panel from "./componentes/Panel";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [mostrarLogin, setMostrarLogin] = useState(false);

  return (
    <main className="min-h-screen w-full relative">
      
      {/* -----------------------------------------------
          ESCENARIO A: USUARIO NO LOGUEADO (PÚBLICO)
         ----------------------------------------------- */}
      {!usuario && (
        <>
          {/* 1. Barra de Navegación (Solo se ve aquí) */}
          <BarraNavegacion 
            alClickLogin={() => setMostrarLogin(true)} 
            alClickInicio={() => setUsuario(null)} 
          />

          {/* 2. Portada (Aquí vive la imagen de fondo) */}
          <Portada />

          {/* 3. Modal de Login (Solo si se activó) */}
          {mostrarLogin && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="relative">
                <button 
                  onClick={() => setMostrarLogin(false)}
                  className="absolute top-2 right-2 text-white hover:text-red-500 font-bold text-xl z-50"
                >
                  ✕
                </button>
                <Login onLogin={(datos) => {
                  setUsuario(datos);
                  setMostrarLogin(false);
                }} />
              </div>
            </div>
          )}
        </>
      )}

      {/* -----------------------------------------------
          ESCENARIO B: USUARIO LOGUEADO (PANEL)
         ----------------------------------------------- */}
      {usuario && (
        <div className="bg-gray-100 min-h-screen w-full">
           {/* Aquí cargamos el Panel, que ya trae su propia cabecera y campana */}
           <Panel usuario={usuario} />
        </div>
      )}

    </main>
  );
}

export default App;