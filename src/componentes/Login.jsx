import React, { useState } from 'react';

function Login({ onLogin }) {
  // 1. Cambiamos 'nombre' por 'email' 
  const [email, setEmail] = useState(''); 
  const [clave, setClave] = useState('');
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const manejarLogin = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);

    try {
      const respuesta = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        // Enviamos email y clave al AuthController de Laravel
        body: JSON.stringify({ email: email, clave: clave })
      });

      const data = await respuesta.json();

      if (data.exito) {
        // 🚀 GUARDAR TOKEN: Requisito fundamental de Sanctum
        localStorage.setItem('token', data.token); 
        
      
        onLogin(data.usuario); 
      } else {
        setError(data.mensaje || 'Datos incorrectos 🚫');
        setCargando(false);
      }

    } catch (err) {
      setError('Error de conexión con el servidor');
      setCargando(false);
    }
  };

  // --- ESTILOS ---
  const estilos = {
    contenedor: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#333' },
    tarjeta: { background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', width: '320px', textAlign: 'center' },
    input: { width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' },
    boton: { width: '100%', padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' },
    error: { color: 'red', fontSize: '13px', marginBottom: '10px', background: '#fee2e2', padding: '5px', borderRadius: '4px' },
    link: { color: '#007bff', fontSize: '14px', marginTop: '15px', cursor: 'pointer', textDecoration: 'underline', display: 'block' }
  };

  return (
    <div style={estilos.contenedor}>
      <div style={estilos.tarjeta}>
        <h2 style={{marginTop: 0}}>🏢 Panel Condominio</h2>
        <p style={{color: '#666'}}>Inicia sesión con tu correo</p>
        
        <form onSubmit={manejarLogin}>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
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
            {cargando ? '🔄 Autenticando...' : 'Ingresar'}
          </button>
        </form>

        {/* Opción para nuevos vecinos (Actividad de validación por correo) */}
        <span style={estilos.link} onClick={() => alert("Aquí abriríamos el formulario de Registro")}>
          ¿Eres nuevo vecino? Regístrate aquí
        </span>
      </div>
    </div>
  );
}

export default Login;