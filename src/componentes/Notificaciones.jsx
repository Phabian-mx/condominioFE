import React, { useState, useEffect } from 'react';
//aca estaba la supabase 

const Notificaciones = () => {
  const [mensajes, setMensajes] = useState([]); 
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [hayNuevas, setHayNuevas] = useState(false);

  useEffect(() => {
    // 1. CARGA ASÍNCRONA DEL HISTORIAL
  const cargarHistorial = async () => {
      try {
        // Hacemos la petición GET a tu nueva API de Laravel
        const respuesta = await fetch('http://localhost:8000/api/notificaciones');
        
        if (!respuesta.ok) {
          throw new Error('Error en la red o servidor');
        }

        const data = await respuesta.json(); // Convertimos la respuesta a JSON

        if (data && data.length > 0) {
          // Formateamos (tu lógica sigue intacta)
          const historialFormateado = data.map(n => ({
            id: n.id,
            texto: n.mensaje,
            hora: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          
          setMensajes(historialFormateado);

          // --- 🔥 LÓGICA NUEVA: PUNTITO ROJO AL ENTRAR 🔥 ---
          // Recuperamos el ID del último mensaje que el vecino vio la última vez
          const ultimoVisto = localStorage.getItem('ultimo_aviso_visto');
          
          // El mensaje más reciente es el primero de la lista (índice 0)
          const mensajeMasReciente = historialFormateado[0].id;

          // Si el ID más nuevo es diferente al que tenemos guardado, ¡HAY NUEVO!
          // Convertimos a String ambos para evitar errores de tipos (número vs texto)
          if (String(mensajeMasReciente) !== String(ultimoVisto)) {
            setHayNuevas(true);
          }
        }

      } catch (error) {
        console.error("Error historial:", error.message);
      }
    };

    cargarHistorial(); 

    // 2. ESCUCHA EN VIVO
    if (window.Echo) {
      window.Echo.channel('comunidad')
        .listen('.asamblea.creada', (e) => {
          console.log("⚡ Alerta en vivo:", e);
          
          // Creamos el objeto del mensaje nuevo
          const nuevoMensaje = { 
            id: Date.now(), // ID temporal
            texto: e.mensaje, 
            hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          };

          setMensajes((prev) => [nuevoMensaje, ...prev]);
          setHayNuevas(true); // Prender foco rojo inmediatamente
        });
    }

    return () => {
      if (window.Echo) window.Echo.leave('comunidad');
    };
  }, []);

  const alternarMenu = () => {
    const nuevoEstado = !mostrarMenu;
    setMostrarMenu(nuevoEstado);

    // --- 🔥 AL ABRIR, MARCAMOS TODO COMO VISTO 🔥 ---
    if (nuevoEstado === true && mensajes.length > 0) {
      setHayNuevas(false); // Apagamos el foco
      // Guardamos en la memoria del navegador el ID del mensaje más nuevo (el primero)
      localStorage.setItem('ultimo_aviso_visto', mensajes[0].id);
    }
  };

  return (
    <div className="relative inline-block ml-2">
      <button 
        onClick={alternarMenu}
        className="relative p-2 rounded-full bg-white text-gray-600 shadow border border-gray-200 hover:bg-gray-100 transition focus:outline-none"
      >
        <span className="text-xl">🔔</span>
        {hayNuevas && (
          <span className="absolute top-0 right-0 h-3 w-3 bg-red-600 rounded-full animate-pulse border border-white"></span>
        )}
      </button>

      {mostrarMenu && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-700">Notificaciones</h3>
            <span className="text-xs text-gray-500">Recientes</span>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {mensajes.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                📭 No hay avisos.
              </div>
            ) : (
              mensajes.map((msg) => (
                <div key={msg.id} className="p-3 border-b border-gray-100 hover:bg-yellow-50 transition">
                  <p className="text-sm text-gray-800 font-medium">{msg.texto}</p>
                  <span className="text-xs text-gray-400 block mt-1">{msg.hora}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notificaciones;