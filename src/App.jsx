import { useState } from 'react';
// IMPORTACIONES: Traemos las piezas del rompecabezas
import Portada from "./componentes/Portada";
import BarraNavegacion from "./componentes/BarraNavegacion";
import VentanaAcceso from "./componentes/VentanaAcceso";
import PanelAdmin from "./componentes/PanelAdmin";

function App() {
  // --- MEMORIA DE LA PÁGINA (Estados) ---
  
  // 1. 'vista' nos dice qué pantalla mostrar (inicio, administracion, etc.)
  const [vista, setVista] = useState('inicio');
  
  // 2. 'mostrarAcceso' es el switch (on/off) para la ventanita de login
  const [mostrarAcceso, setMostrarAcceso] = useState(false);

  // --- LÓGICA DE CONTROL ---

  // Esta función decide a dónde mandar al usuario cuando le da a "ENTRAR"
  const manejarEntrada = (usuario) => {
    setMostrarAcceso(false); // Cerramos el cuadro de login
    
    if (usuario === "admin") {
      setVista("administracion"); // Mandamos al jefe a su panel
    } else {
      setVista("chat"); // Mandamos al vecino al chat
    }
  };

  return (
    // 'relative' permite que las cosas se encimen correctamente
    // 'min-h-screen' asegura que la página ocupe todo el alto del monitor
    <main className="relative min-h-screen w-full overflow-hidden">
      
      {/* 1. LA NAVEGACIÓN: Siempre está al frente (z-index alto) */}
      <BarraNavegacion 
        alClickLogin={() => setMostrarAcceso(true)} 
        alClickInicio={() => setVista('inicio')} 
      />
      
      {/* 2. LA PORTADA: Es la imagen de fondo. Si sale azul, revisa que esté aquí */}
      <Portada />

      {/* 3. EL LOGIN: Solo aparece si 'mostrarAcceso' es verdadero (true) */}
      <VentanaAcceso 
        estaAbierta={mostrarAcceso} 
        cerrar={() => setMostrarAcceso(false)} 
        alEntrar={manejarEntrada}
      />

      {/* 4. EL PANEL DE CONTROL: Se dibuja encima de la portada si eres admin */}
      {vista === 'administracion' && (
        <PanelAdmin alSalir={() => setVista('inicio')} />
      )}
      
      {/* 5. VISTA DE VECINOS: Lo que ve el usuario normal */}
      {vista === 'chat' && (
        <div className="fixed inset-0 z-[150] bg-white flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold">Área de Vecinos</h1>
            <button onClick={() => setVista('inicio')} className="mt-4 bg-slate-800 text-white p-2">
              Regresar
            </button>
        </div>
      )}
    </main>
  );
}

export default App;