import React from 'react';

// Recibimos las nuevas propiedades: esAdmin, onEliminar, onLimpiar
function TarjetaVotacion({ datos, alVotar, esAdmin, onEliminar, onLimpiar }) {
  
  const votosA = datos.votos_a || 0;
  const votosB = datos.votos_b || 0;
  const total = votosA + votosB;
  const porc_a = total === 0 ? 0 : Math.round((votosA / total) * 100);
  const porc_b = total === 0 ? 0 : Math.round((votosB / total) * 100);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 mb-4 transition hover:shadow-xl relative">
      
      {/* 1. BOTONES DE ADMIN (Solo visibles para admin) */}
      {esAdmin && (
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={() => onLimpiar(datos.id)}
            title="Reiniciar votos a cero"
            className="p-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
          >
            🔄 Limpiar
          </button>
          <button 
            onClick={() => onEliminar(datos.id)}
            title="Eliminar encuesta"
            className="p-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            🗑️ Borrar
          </button>
        </div>
      )}

      <h3 className="text-xl font-bold text-slate-800 mb-2 pr-20">{datos.titulo}</h3>
      <p className="text-gray-600 mb-4">{datos.descripcion}</p>

      <div className="space-y-3">
        {/* Opción A */}
        <button 
          onClick={() => alVotar(datos.id, 'votos_a', votosA)}
          className="w-full relative h-12 bg-blue-50 rounded overflow-hidden border border-blue-200 group hover:border-blue-400 transition"
        >
          <div className="absolute top-0 left-0 h-full bg-blue-200 transition-all duration-500" style={{ width: `${porc_a}%` }}></div>
          <div className="relative flex justify-between px-4 items-center h-full z-10 text-slate-700">
            <span className="font-medium">{datos.opcion_a || "Opción A"}</span>
            <span className="font-bold text-blue-700">{porc_a}%</span>
          </div>
        </button>

        {/* Opción B */}
        <button 
          onClick={() => alVotar(datos.id, 'votos_b', votosB)}
          className="w-full relative h-12 bg-orange-50 rounded overflow-hidden border border-orange-200 group hover:border-orange-400 transition"
        >
          <div className="absolute top-0 left-0 h-full bg-orange-200 transition-all duration-500" style={{ width: `${porc_b}%` }}></div>
          <div className="relative flex justify-between px-4 items-center h-full z-10 text-slate-700">
            <span className="font-medium">{datos.opcion_b || "Opción B"}</span>
            <span className="font-bold text-orange-700">{porc_b}%</span>
          </div>
        </button>
      </div>
      
      <p className="text-xs text-center mt-3 text-gray-400">Total: {total}</p>
    </div>
  );
}

export default TarjetaVotacion;