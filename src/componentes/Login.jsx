import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; 

function Login({ onLogin }) {
  const [nombre, setNombre] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const manejarLogin = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('nombre', nombre)
        .eq('clave', clave)
        .single();

      if (error || !data) {
        setError('Datos incorrectos 🚫');
        setCargando(false);
        return;
      }
      onLogin(data); 

    } catch (err) {
      setError('Error de conexión');
      setCargando(false);
    }
  };

  // ESTILOS BONITOS (CSS en JS)
  const estilos = {
    contenedor: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: '#333',
    },
    tarjeta: {
      background: 'white',
      padding: '2rem',
      borderRadius: '15px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      width: '300px',
      textAlign: 'center',
    },
    input: {
      width: '100%',
      padding: '10px',
      margin: '10px 0',
      borderRadius: '5px',
      border: '1px solid #ccc',
      boxSizing: 'border-box' // Para que el padding no rompa el ancho
    },
    boton: {
      width: '100%',
      padding: '10px',
      background: '#007bff', // Azul bonito
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      marginTop: '10px'
    },
    error: {
      color: 'red',
      fontSize: '14px',
      marginBottom: '10px'
    }
  };

  return (
    <div style={estilos.contenedor}>
      <div style={estilos.tarjeta}>
        <h2 style={{marginTop: 0}}>🏢 Condominio</h2>
        <p style={{color: '#666'}}>Ingresa tus datos de vecino</p>
        
        <form onSubmit={manejarLogin}>
          <input 
            type="text" 
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Usuario (ej: admin)"
            required 
            style={estilos.input}
          />

          <input 
            type="password" 
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            placeholder="Contraseña"
            required
            style={estilos.input}
          />

          {error && <p style={estilos.error}>{error}</p>}

          <button type="submit" disabled={cargando} style={estilos.boton}>
            {cargando ? '🔄 Verificando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;