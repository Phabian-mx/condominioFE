import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import TarjetaVotacion from './TarjetaVotacion';
import Notificaciones from './Notificaciones'; 

function Panel({ usuario }) {
  const [encuestas, setEncuestas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // --- 1. WEBSOCKET SUPABASE (REALTIME VOTOS) ---
  useEffect(() => {
    obtenerEncuestas();
    const canal = supabase
      .channel('cambios_votos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'encuestas' }, () => {
        obtenerEncuestas();
      })
      .subscribe();
    return () => { supabase.removeChannel(canal); };
  }, []);

  const obtenerEncuestas = async () => {
    try {
      const { data, error } = await supabase
        .from('encuestas').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setEncuestas(data);
    } catch (error) { console.error(error); } finally { setCargando(false); }
  };

  // --- 2. FUNCIONES DE USUARIO (VOTAR) ---
  const manejarVoto = async (encuestaId, columna, votosActuales) => {
    try {
      // Verificar si ya votó
      const { data: yaVoto } = await supabase
        .from('historial_votos').select('id')
        .eq('usuario_id', usuario.id).eq('encuesta_id', encuestaId).maybeSingle();

      if (yaVoto) { alert("⛔ Ya votaste aquí."); return; }

      // Registrar historial y sumar voto
      await supabase.from('historial_votos').insert([{ usuario_id: usuario.id, encuesta_id: encuestaId }]);
      await supabase.from('encuestas').update({ [columna]: votosActuales + 1 }).eq('id', encuestaId);

    } catch (error) { alert('Error al votar'); }
  };

  // --- 3. FUNCIONES DE ADMIN ---
  const crearEncuesta = async () => {
    const titulo = prompt("Título de la nueva votación:");
    if (!titulo) return;
    const desc = prompt("Descripción corta:");
    const opA = prompt("Nombre Opción A (ej. Blanco):", "Opción A");
    const opB = prompt("Nombre Opción B (ej. Azul):", "Opción B");

    const { error } = await supabase
      .from('encuestas')
      .insert([{ titulo, descripcion: desc, opcion_a: opA, opcion_b: opB }]);

    if (error) alert("Error al crear: " + error.message);
  };

  const eliminarEncuesta = async (id) => {
    if (!confirm("⚠️ ¿Estás seguro de BORRAR esta encuesta? Se perderán los datos.")) return;
    await supabase.from('historial_votos').delete().eq('encuesta_id', id);
    const { error } = await supabase.from('encuestas').delete().eq('id', id);
    if (error) alert("Error al eliminar");
  };

  const limpiarVotos = async (id) => {
    if (!confirm("🔄 ¿Reiniciar contadores a CERO?")) return;
    await supabase.from('historial_votos').delete().eq('encuesta_id', id);
    const { error } = await supabase
      .from('encuestas').update({ votos_a: 0, votos_b: 0 }).eq('id', id);
    if (error) alert("Error al limpiar");
  };

  // --- 4. ALERTA / NOTIFICACIONES ---
  const lanzarAlerta = async () => {
    const mensaje = prompt("✍️ Escribe el aviso para los vecinos:", "¡Reunión urgente en recepción!");
    if (!mensaje) return; 

    try {
      // A) Guardar en Historial (Supabase)
      const { error } = await supabase
        .from('notificaciones') 
        .insert([{ mensaje: mensaje }]);

      if (error) {
        console.error("Error guardando en BD (Revisar RLS):", error);
        alert("⚠️ Hubo un problema guardando el historial, pero intentaremos enviar la alerta.");
      }

      // B) Enviar Alerta Realtime (Laravel)
      const respuesta = await fetch(`http://localhost:8000/crear-asamblea?mensaje=${encodeURIComponent(mensaje)}`);
      
      if(respuesta.ok) {
        alert(`✅ Notificación guardada y enviada: "${mensaje}"`);
      } else {
        alert("⚠️ Guardado en historial, pero el servidor de alertas falló.");
      }

    } catch (error) {
      console.error("Error general:", error);
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