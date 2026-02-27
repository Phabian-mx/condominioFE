import React, { useState } from 'react';

function RegistroVecino() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(false);

  const manejarRegistro = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje(null);

    const token = localStorage.getItem('token'); 

    try {
      const respuesta = await fetch('http://localhost:8000/api/registrar-vecino', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ nombre, email })
      });

      const data = await respuesta.json();

      if (data.exito) {
        setMensaje({ tipo: 'exito', texto: '✅ Vecino registrado. Correo de validación enviado.' });
        setNombre('');
        setEmail('');
      } else {
        setMensaje({ tipo: 'error', texto: '❌ ' + (data.mensaje || 'Error al registrar') });
      }
    } catch (err) {
      setMensaje({ tipo: 'error', texto: '📡 Error de conexión con el servidor' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginTop: '20px', border: '1px solid #ddd' }}>
      <h3>📝 Registrar Nuevo Vecino</h3>
      <p style={{ fontSize: '14px', color: '#666' }}>Se enviará un correo de validación automáticamente.</p>
      
      <form onSubmit={manejarRegistro}>
        <input 
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
          type="text" 
          placeholder="Nombre completo" 
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required 
        />
        <input 
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
          type="email" 
          placeholder="Correo electrónico" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <button 
          type="submit" 
          disabled={cargando}
          style={{ background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
        >
          {cargando ? 'Enviando...' : 'Dar de Alta Vecino'}
        </button>
      </form>

      {mensaje && (
        <p style={{ marginTop: '10px', color: mensaje.tipo === 'exito' ? 'green' : 'red', fontWeight: 'bold' }}>
          {mensaje.texto}
        </p>
      )}
    </div>
  );
}

export default RegistroVecino;