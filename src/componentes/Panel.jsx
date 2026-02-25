import React, { useState, useEffect } from 'react';
import TarjetaVotacion from './TarjetaVotacion';
import Notificaciones from './Notificaciones'; 

function Panel({ usuario }) {
  const [encuestas, setEncuestas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // --- 1. CARGAR ENCUESTAS DESDE LARAVEL ---
  useEffect(() => {
    obtenerEncuestas();
  }, []);

  const obtenerEncuestas = async () => {
    try {
      const respuesta = await fetch('http://localhost:8000/api/encuestas');
      if (respuesta.ok) {
        const data = await respuesta.json();
        setEncuestas(data);
      }
    } catch (error) { 
      console.error("Error cargando encuestas:", error); 
    } finally { 
      setCargando(false); 
    }
  };

  // --- 2. FUNCIONES TEMPORALES (Migrando a Laravel...) ---
  const manejarVoto = async (encuestaId, columna, votosActuales) => {
    alert("🚧 Votación en proceso de migración a Laravel.");
  };

  const crearEncuesta = async () => {
    alert("🚧 Creación en proceso de migración a Laravel.");
  };

  const eliminarEncuesta = async (id) => {
    alert("🚧 Eliminación en proceso de migración a Laravel.");
  };

  const limpiarVotos = async (id) => {
    alert("🚧 Limpieza en proceso de migración a Laravel.");
  };

  // --- 4. ALERTA / NOTIFICACIONES (Ya usando Laravel) ---
  const lanzarAlerta = async () => {
    const mensaje = prompt("✍️ Escribe el aviso para los vecinos:", "¡Reunión urgente en recepción!");
    if (!mensaje) return; 

    try {
      // Enviar Alerta a Laravel
      const respuesta = await fetch(`http://localhost:8000/crear-asamblea?mensaje=${encodeURIComponent(mensaje)}`);
      
      if(respuesta.ok) {
        alert(`✅ Notificación enviada: "${mensaje}"`);
      } else {
        alert("⚠️ Hubo un error al enviar la notificación.");
      }
    } catch (error) {
      alert("❌ Error de conexión. Revisa que el Backend esté corriendo.");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-4 gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">🏡 Panel de Vecinos</h1>
          <div className="flex items-center gap-2 text-slate-500 mt-1">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <p>Hola, <strong>{usuario.nombre || usuario.email}</strong> {usuario.es_admin && "(Administrador)"}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 justify-center">
          {usuario.es_admin && (
            <>
              <button onClick={crearEncuesta} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition font-bold">
                + Nueva Encuesta
              </button>
              <button onClick={lanzarAlerta} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow transition font-bold flex items-center gap-2">
                📢 Convocar
              </button>
            </>
          )}
          <button onClick={() => window.location.reload()} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition">
            Salir
          </button>
          
          <Notificaciones />
        </div>
      </header>

      {cargando ? (
        <p className="text-center text-gray-500 py-10">Cargando encuestas...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {encuestas.length === 0 && <p className="text-gray-500 col-span-3 text-center">No hay encuestas activas.</p>}
          {encuestas.map((item) => (
            <TarjetaVotacion 
              key={item.id} 
              datos={item} 
              alVotar={manejarVoto}
              esAdmin={usuario.es_admin}      
              onEliminar={eliminarEncuesta}   
              onLimpiar={limpiarVotos}        
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Panel;