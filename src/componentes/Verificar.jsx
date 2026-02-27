import React, { useState } from 'react';

function Verificar({ id, alTerminar }) {
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const manejarRegistroFinal = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas de seguridad
    if (password.length < 6) {
      setMensaje({ texto: 'La contraseña debe tener al menos 6 caracteres', tipo: 'error' });
      return;
    }

    if (password !== confirmar) {
      setMensaje({ texto: 'Las contraseñas no coinciden', tipo: 'error' });
      return;
    }

    setCargando(true);
    setMensaje({ texto: '', tipo: '' }); // Limpiar mensajes previos

    try {
      // Usamos la ruta que definimos en api.php
      const respuesta = await fetch(`http://localhost:8000/api/vecinos/finalizar-registro`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify({ 
          id: id, 
          password: password 
        }),
      });

      const data = await respuesta.json();

      if (respuesta.ok && data.exito) {
        setMensaje({ texto: '¡Contraseña creada con éxito! Ya puedes entrar.', tipo: 'exito' });
        
        setTimeout(() => alTerminar(), 2000); 
      } else {
        setMensaje({ 
          texto: data.mensaje || 'Error al guardar la contraseña', 
          tipo: 'error' 
        });
      }
    } catch (error) {
      setMensaje({ texto: 'Error de conexión con el servidor (Backend apagado o CORS)', tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md w-full border border-slate-100">
        <div className="text-5xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Crea tu contraseña</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Estás activando la cuenta para el vecino ID: <strong>{id}</strong>. 
          Elige una contraseña segura para finalizar.
        </p>

        <form onSubmit={manejarRegistroFinal} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Nueva Contraseña</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Confirmar Contraseña</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
            />
          </div>

          {mensaje.texto && (
            <div className={`p-3 rounded-lg text-sm font-medium animate-bounce ${
              mensaje.tipo === 'exito' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {mensaje.tipo === 'exito' ? '✅' : '❌'} {mensaje.texto}
            </div>
          )}

          <button 
            type="submit"
            disabled={cargando}
            className={`w-full py-3 rounded-lg font-bold text-white transition shadow-lg ${
              cargando ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-95'
            }`}
          >
            {cargando ? 'Guardando...' : 'Activar mi Cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Verificar;