import { useState, useRef } from 'react'; 
import { CSSTransition } from 'react-transition-group'; // <--- para la tramsicion

// --- COMPONENTES ---
import Portada from "./componentes/Portada";
import BarraNavegacion from "./componentes/BarraNavegacion";
import Login from "./componentes/Login";
import Panel from "./componentes/Panel";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  
  // Referencia para la animación (necesario para que no de error en consola)
  const nodeRef = useRef(null);

  return (
    <main className="min-h-screen w-full relative">
      
     
      {!usuario && (
        <>
    
          <BarraNavegacion 
            alClickLogin={() => setMostrarLogin(true)} 
            alClickInicio={() => setUsuario(null)} 
          />

          {/* 2. Portada (imagen de fondo) */}
          <Portada />

       
          <CSSTransition
            in={mostrarLogin}
            timeout={10000}
            classNames="modal"
            unmountOnExit
            nodeRef={nodeRef}
          >
            <div 
              ref={nodeRef} 
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
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
          </CSSTransition>
        </>
      )}


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