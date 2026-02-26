import React, { useState, useEffect } from 'react';
import TarjetaVotacion from './TarjetaVotacion';
import Notificaciones from './Notificaciones'; 

function Panel({ usuario }) {
  const [encuestas, setEncuestas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // --- 1. CARGAR ENCUESTAS INICIALES Y CONFIGURAR REALTIME ---
  useEffect(() => {
    obtenerEncuestas();

    // 📡 ESCUCHAR EVENTOS EN TIEMPO REAL (Laravel Echo)
    const canal = window.Echo.channel('condominio-canal')
      .listen('.voto-actualizado', (e) => {
        console.log("🗳️ Actualización de voto recibida:", e.encuesta);
        
        // Actualizamos solo la encuesta que cambió en el estado
        setEncuestas((prev) => 
          prev.map((enc) => (enc.id === e.encuesta.id ? e.encuesta : enc))
        );
      })
      .listen('.aviso-creado', (e) => {
        // Esto permite que el componente Notificaciones sepa que hay algo nuevo
        console.log("📢 Nuevo aviso en el sistema");
      });

    // Limpiar conexión al salir
    return () => {
      window.Echo.leaveChannel('condominio-canal');
    };
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

  // --- 2. FUNCIONES DE ACCIÓN ---
  
  const manejarVoto = async (encuestaId, columna) => {
    try {
      const respuesta = await fetch(`http://localhost:8000/api/encuestas/${encuestaId}/votar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ usuario_id: usuario.id, columna: columna })
      });

      const data = await respuesta.json();

      if (!data.exito) {
        alert("⛔ " + data.mensaje); 
      }
     
    } catch (error) { 
      alert('Error de conexión al intentar votar'); 
    }
  };

  const crearEncuesta = async () => {
    const titulo = prompt("Título de la nueva votación:");
    if (!titulo) return;
    const desc = prompt("Descripción corta:");
    const opA = prompt("Nombre Opción A:", "Opción A");
    const opB = prompt("Nombre Opción B:", "Opción B");

    try {
      const respuesta = await fetch('http://localhost:8000/api/encuestas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ titulo, descripcion: desc, opcion_a: opA, opcion_b: opB })
      });

      if (respuesta.ok) {
        obtenerEncuestas(); // Aquí sí recargamos para ver la nueva encuesta creada
      }
    } catch (error) { 
      alert("Error al crear la encuesta"); 
    }
  };

  const eliminarEncuesta = async (id) => {
    if (!confirm("⚠️ ¿Estás seguro de BORRAR esta encuesta?")) return;
    try {
      const respuesta = await fetch(`http://localhost:8000/api/encuestas/${id}`, { method: 'DELETE' });
      if (respuesta.ok) {
        setEncuestas((prev) => prev.filter(enc => enc.id !== id));
      }
    } catch (error) { 
      alert("Error al eliminar"); 
    }
  };

  const limpiarVotos = async (id) => {
    if (!confirm("🔄 ¿Reiniciar contadores a CERO?")) return;
    try {
      await fetch(`http://localhost:8000/api/encuestas/${id}/limpiar`, { method: 'POST' });
      // El WebSocket se encargará de poner los contadores a 0 en la pantalla
    } catch (error) { 
      alert("Error al limpiar"); 
    }
  };

  const lanzarAlerta = async () => {
    const mensaje = prompt("✍️ Escribe el aviso para los vecinos:");
    if (!mensaje) return; 

    try {
      const respuesta = await fetch('http://localhost:8000/api/notificaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ mensaje: mensaje })
      });
      
      if(!respuesta.ok) alert("⚠️ Error al enviar notificación.");
    } catch (error) {
      alert("❌ Error de conexión.");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-4 gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">🏡 Panel de Vecinos</h1>
          <div className="flex items-center gap-2 text-slate-500 mt-1">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <p>Hola, <strong>{usuario.nombre}</strong> {usuario.es_admin ? "(Admin)" : ""}</p>
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