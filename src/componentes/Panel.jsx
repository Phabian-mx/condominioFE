import React, { useState, useEffect } from 'react';
import TarjetaVotacion from './TarjetaVotacion';
import Notificaciones from './Notificaciones'; 
import RegistroVecino from './RegistroVecino'; 

function Panel({ usuario }) {
  const [encuestas, setEncuestas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  // 🔑 La "llave" para que Laravel nos deje pasar
  const token = localStorage.getItem('token');
  const headersProtegidos = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  useEffect(() => {
    obtenerEncuestas();
    const canal = window.Echo.channel('condominio-canal')
      .listen('.voto-actualizado', (e) => {
        setEncuestas((prev) => 
          prev.map((enc) => (enc.id === e.encuesta.id ? e.encuesta : enc))
        );
      });
    return () => { window.Echo.leaveChannel('condominio-canal'); };
  }, []);

  const obtenerEncuestas = async () => {
    try {
      const respuesta = await fetch('http://localhost:8000/api/encuestas', { 
        headers: headersProtegidos 
      });
      if (respuesta.ok) {
        const data = await respuesta.json();
        setEncuestas(data);
      }
    } catch (error) { console.error("Error cargando encuestas:", error); } 
    finally { setCargando(false); }
  };

  // --- 🚀 FUNCIÓN: CREAR NUEVA ENCUESTA (CORREGIDA) ---
  const crearEncuesta = async () => {
    const titulo = prompt("Título de la nueva votación:");
    if (!titulo) return;
    const desc = prompt("Descripción corta:");
    const opA = prompt("Nombre Opción A:", "Opción A");
    const opB = prompt("Nombre Opción B:", "Opción B");

    try {
      const respuesta = await fetch('http://localhost:8000/api/encuestas', {
        method: 'POST',
        headers: headersProtegidos, // <--- Importante para Sanctum
        body: JSON.stringify({ 
            titulo, 
            descripcion: desc, 
            opcion_a: opA, 
            opcion_b: opB 
        })
      });

      if (respuesta.ok) {
        obtenerEncuestas(); // Recargamos la lista
      } else {
        alert("Error al crear: Verifica los permisos");
      }
    } catch (error) { 
      alert("Error de conexión"); 
    }
  };

  const lanzarAlerta = async () => {
    const mensaje = prompt("✍️ Escribe el aviso para los vecinos:");
    if (!mensaje) return; 
    try {
      await fetch('http://localhost:8000/api/notificaciones', {
        method: 'POST',
        headers: headersProtegidos,
        body: JSON.stringify({ mensaje })
      });
    } catch (error) { alert("Error al enviar aviso"); }
  };

  const manejarVoto = async (encuestaId, columna) => {
    try {
      await fetch(`http://localhost:8000/api/encuestas/${encuestaId}/votar`, {
        method: 'POST',
        headers: headersProtegidos,
        body: JSON.stringify({ columna })
      });
    } catch (error) { alert('Error al votar'); }
  };

  const eliminarEncuesta = async (id) => {
    if (!confirm("⚠️ ¿Borrar encuesta?")) return;
    try {
      const respuesta = await fetch(`http://localhost:8000/api/encuestas/${id}`, { 
        method: 'DELETE', 
        headers: headersProtegidos 
      });
      if (respuesta.ok) setEncuestas(prev => prev.filter(e => e.id !== id));
    } catch (error) { alert("Error al eliminar"); }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-4 gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">🏡 Panel de Vecinos</h1>
          <p className="text-slate-500">Hola, <strong>{usuario.nombre}</strong> (Admin)</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {usuario.es_admin && (
            <>
              <button onClick={lanzarAlerta} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow font-bold flex items-center gap-2">
                📢 Convocar
              </button>
              
              <button onClick={() => setMostrarRegistro(!mostrarRegistro)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow font-bold">
                {mostrarRegistro ? "✖️ Cerrar Registro" : "👤 Nuevo Vecino"}
              </button>

              {/* ✅ BOTÓN CONECTADO A LA FUNCIÓN crearEncuesta */}
              <button onClick={crearEncuesta} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow font-bold">
                + Nueva Encuesta
              </button>
            </>
          )}
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="bg-red-500 text-white px-4 py-2 rounded shadow">
            Salir
          </button>
          <Notificaciones />
        </div>
      </header>

      {usuario.es_admin && mostrarRegistro && (
        <div className="mb-10">
          <RegistroVecino />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {encuestas.map((item) => (
            <TarjetaVotacion 
              key={item.id} 
              datos={item} 
              alVotar={manejarVoto}
              esAdmin={usuario.es_admin}
              onEliminar={eliminarEncuesta}
            />
          ))}
      </div>
    </div>
  );
}

export default Panel;