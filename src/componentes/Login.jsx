import React, { useState } from 'react';

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
      // 🚀 Hacemos la petición a nuestra API en Laravel
      const respuesta = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        // Enviamos los datos en formato JSON
        body: JSON.stringify({ nombre: nombre, clave: clave })
      });

      const data = await respuesta.json();

      if (data.exito) {
        // Si el login fue exitoso, pasamos el usuario al componente padre
        onLogin(data.usuario); 
      } else {
        // Si la API devuelve error (exito: false)
        setError('Datos incorrectos 🚫');
        setCargando(false);
      }

    } catch (err) {
      setError('Error de conexión con el servidor');
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
      background: '#007bff', // Azul 
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