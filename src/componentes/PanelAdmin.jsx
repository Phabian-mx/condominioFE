import { useState, useEffect } from 'react';
import { io } from 'socket.io-client'; // La herramienta para el chat en vivo

// Nos conectamos al "puente" que creamos en el servidor (puerto 3001)
const socket = io('http://localhost:3001'); 

export default function PanelAdmin({ alSalir }) {
  const [mensaje, setMensaje] = useState(""); // Lo que el admin está escribiendo
  const [mensajes, setMensajes] = useState([]); // La lista de todos los mensajes que llegan
  const [vecinoActivo, setVecinoActivo] = useState(null); // Qué vecino tenemos seleccionado

  // El 'useEffect' se activa apenas se abre esta pantalla
  useEffect(() => {
    // Aquí el navegador se queda "escuchando" si algún vecino manda un mensaje
    socket.on('mensaje_desde_vecino', (data) => {
      // Si llega algo, lo pegamos en nuestra lista de mensajes
      setMensajes((prev) => [...prev, data]);
    });

    // Si cerramos el panel, dejamos de escuchar para no gastar memoria
    return () => socket.off('mensaje_desde_vecino');
  }, []);

  // Función para mandar mensajes
  const enviarMensaje = (e) => {
    e.preventDefault(); // Evita que la página se refresque al dar Enter
    
    if (!mensaje.trim() || !vecinoActivo) return;

    // Creamos el paquete del mensaje con la hora y a quién va dirigido
    const nuevoMsg = {
      texto: mensaje,
      emisor: "Admin",
      receptor: vecinoActivo.id,
      hora: new Date().toLocaleTimeString()
    };

    // 'emit' lanza el mensaje al servidor para que le llegue al vecino
    socket.emit('mensaje_privado', nuevoMsg);
    
    // Lo ponemos en nuestra pantalla para verlo nosotros también
    setMensajes((prev) => [...prev, nuevoMsg]);
    setMensaje(""); // Limpiamos la cajita de escribir
  };

  return (
    <div className="fixed inset-0 z-[200] bg-gray-200 flex flex-col">
       {/* El resto es el dibujo de la lista y las burbujas de chat */}
    </div>
  );
}