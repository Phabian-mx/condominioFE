import React, { useState } from 'react';

function Panel({ usuario }) {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1>🏡 Panel del Condominio</h1>
        <button onClick={() => window.location.reload()} style={{ padding: '8px 16px' }}>
          Cerrar Sesión
        </button>
      </header>

      <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2>👋 Hola, {usuario.nombre}</h2>
        <p>Bienvenido a tu panel de control.</p>
        
        <div style={{ marginTop: '20px', padding: '15px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px' }}>
          <h3>🗳️ Zona de Votación</h3>
          <p>Las encuestas aparecerán aquí.</p>
        </div>
      </div>
    </div>
  );
}

export default Panel; 