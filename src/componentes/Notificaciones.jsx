import React, { useState, useEffect } from 'react';

const Notificaciones = () => {
  const [mensajes, setMensajes] = useState([]); 
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [hayNuevas, setHayNuevas] = useState(false);

  useEffect(() => {
    // 1. CARGA ASÍNCRONA DEL HISTORIAL
    const cargarHistorial = async () => {
      try {
        const respuesta = await fetch('http://localhost:8000/api/notificaciones');
        if (!respuesta.ok) throw new Error('Error en la red o servidor');

        const data = await respuesta.json();

        if (data && data.length > 0) {
          const historialFormateado = data.map(n => ({
            id: n.id,
            texto: n.mensaje,
            hora: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          
          setMensajes(historialFormateado);

          const ultimoVisto = localStorage.getItem('ultimo_aviso_visto');
          const mensajeMasReciente = historialFormateado[0].id;

          if (String(mensajeMasReciente) !== String(ultimoVisto)) {
            setHayNuevas(true);
          }
        }
      } catch (error) {
        console.error("Error historial:", error.message);
      }
    };

    cargarHistorial(); 

    // 2. ESCUCHA EN VIVO USANDO EL ECHO GLOBAL 
    if (window.Echo) {
        window.Echo.channel('condominio-canal')
            .listen('.aviso-creado', (e) => {
              console.log("⚡ Alerta en vivo:", e);
              
              // Formateamos el mensaje tal como lo manda Laravel
              const nuevoMensaje = { 
                id: e.notificacion.id, 
                texto: e.notificacion.mensaje, 
                hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
              };

              // Lo agregamos hasta arriba de la lista
              setMensajes((prev) => [nuevoMensaje, ...prev]);
              setHayNuevas(true); // Prender foco rojo inmediatamente
            });
    } else {
        console.error("⚠️ window.Echo no está inicializado. Revisa main.jsx");
    }

    // 3. Limpiamos al salir
    return () => {
      if (window.Echo) {
          window.Echo.leaveChannel('condominio-canal');
      }
    };
  }, []);

  const alternarMenu = () => {
    const nuevoEstado = !mostrarMenu;
    setMostrarMenu(nuevoEstado);
    
   
    if (nuevoEstado === true && mensajes.length > 0) {
      setHayNuevas(false);
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