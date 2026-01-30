import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import TarjetaVotacion from './TarjetaVotacion';

function Panel({ usuario }) {
  const [encuestas, setEncuestas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // --- 1. WEBSOCKET (REALTIME) ---
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

  // --- 3. FUNCIONES DE ADMIN (SUPERPODERES) 🦸‍♂️ ---
  
  // A) CREAR ENCUESTA
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

  // B) ELIMINAR ENCUESTA
  const eliminarEncuesta = async (id) => {
    if (!confirm("⚠️ ¿Estás seguro de BORRAR esta encuesta? Se perderán los datos.")) return;

    // Primero borramos el historial para que no de error de llave foránea
    await supabase.from('historial_votos').delete().eq('encuesta_id', id);
    // Luego borramos la encuesta
    const { error } = await supabase.from('encuestas').delete().eq('id', id);

    if (error) alert("Error al eliminar");
  };

  // C) LIMPIAR VOTOS (REINICIAR)
  const limpiarVotos = async (id) => {
    if (!confirm("🔄 ¿Reiniciar contadores a CERO?")) return;

    // Borramos historial de quienes votaron
    await supabase.from('historial_votos').delete().eq('encuesta_id', id);
    // Ponemos contadores en 0
    const { error } = await supabase
      .from('encuestas')
      .update({ votos_a: 0, votos_b: 0 })
      .eq('id', id);

    if (error) alert("Error al limpiar");
  };


  return (
    <div className="p-8 max-w-4xl mx-auto font-sans">
      <header className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">🏡 Panel de Vecinos</h1>
          <div className="flex items-center gap-2 text-slate-500">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <p>Hola, <strong>{usuario.nombre}</strong> {usuario.es_admin && "(Administrador)"}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {/* BOTÓN CREAR (SOLO ADMIN) */}
          {usuario.es_admin && (
            <button onClick={crearEncuesta} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition">
              + Nueva Encuesta
            </button>
          )}
          <button onClick={() => window.location.reload()} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition">
            Salir
          </button>
        </div>
      </header>

      {cargando ? <p className="text-center text-gray-500">Cargando...</p> : (
        <div className="grid gap-6 md:grid-cols-2">
          {encuestas.map((item) => (
            <TarjetaVotacion 
              key={item.id} 
              datos={item} 
              alVotar={manejarVoto}
              esAdmin={usuario.es_admin}      // Pasamos el permiso
              onEliminar={eliminarEncuesta}   // Pasamos la función borrar
              onLimpiar={limpiarVotos}        // Pasamos la función limpiar
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Panel;