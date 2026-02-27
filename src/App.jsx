import { useState, useRef, useEffect } from 'react'; 
import { CSSTransition } from 'react-transition-group'; 

// --- COMPONENTES ---
import Portada from "./componentes/Portada";
import BarraNavegacion from "./componentes/BarraNavegacion";
import Login from "./componentes/Login";
import Panel from "./componentes/Panel";
import Verificar from "./componentes/Verificar"; 

function App() {
  const [usuario, setUsuario] = useState(null);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [vistaVerificacion, setVistaVerificacion] = useState(false);
  const [userIdParaVerificar, setUserIdParaVerificar] = useState(null);
  
  const nodeRef = useRef(null);

  // Detectar si el usuario viene desde el correo
  useEffect(() => {
    // 1. Obtenemos la ruta actual (ej: /verificar/10)
    const path = window.location.pathname;

    if (path.includes('/verificar/')) {
      // 2. Extraemos el ID después de la última diagonal
      const id = path.split('/').pop(); 
      
      if (id && !isNaN(id)) {
        setUserIdParaVerificar(id);
        setVistaVerificacion(true);
      }
    }
  }, []);

  return (
    <main className="min-h-screen w-full relative">
      
      {/* VISTA DE VERIFICACIÓN (Cuando dan clic al correo) */}
      {vistaVerificacion && (
        <Verificar 
          id={userIdParaVerificar} 
          alTerminar={() => {
            setVistaVerificacion(false);
            window.history.pushState({}, '', '/'); 
          }} 
        />
      )}

      {/* VISTA PÚBLICA (Portada) */}
      {!usuario && !vistaVerificacion && (
        <>
          <BarraNavegacion 
            alClickLogin={() => setMostrarLogin(true)} 
            alClickInicio={() => setUsuario(null)} 
          />
          <Portada />

          <CSSTransition
            in={mostrarLogin}
            timeout={300}
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
                >✕</button>
                <Login onLogin={(datos) => {
                  setUsuario(datos);
                  setMostrarLogin(false);
                }} />
              </div>
            </div>
          </CSSTransition>
        </>
      )}

      {/* VISTA PRIVADA (Panel Admin) */}
      {usuario && !vistaVerificacion && (
        <div className="bg-gray-100 min-h-screen w-full">
           <Panel usuario={usuario} />
        </div>
      )}

    </main>
  );
}

export default App;