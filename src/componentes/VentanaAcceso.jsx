
import Login from "./Login";

export default function VentanaAcceso({ estaAbierta, cerrar, alEntrar }) {
  if (!estaAbierta) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative">
        <button 
          onClick={cerrar}
          className="absolute -top-10 right-0 text-white font-bold hover:text-gray-300"
        >
          Cerrar [X]
        </button>
        <Login onLogin={alEntrar} />
      </div>
    </div>
  );
}