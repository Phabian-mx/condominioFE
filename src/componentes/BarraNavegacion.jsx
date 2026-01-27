// Recibimos 'alClickLogin' para que el botón de entrar funcione
export default function BarraNavegacion({ alClickLogin }) {
  return (
    // 'fixed top-6 right-6' lo ancla a la esquina superior derecha
    <nav className="fixed top-6 right-6 z-50">
      
      {/* 'bg-slate-700/80' aplica el gris oscuro transparente a TODA la barra.
          'backdrop-blur-md' da el efecto de vidrio esmerilado.
      */}
      <ul className="flex flex-row items-center gap-8 bg-slate-700/80 backdrop-blur-md px-10 py-3 rounded-full text-white shadow-2xl list-none m-0 border border-white/10">
        
        {/* Los enlaces normales */}
        <li className="cursor-pointer font-medium hover:text-gray-300 transition-colors">
          Inicio
        </li>
        <li className="cursor-pointer font-medium hover:text-gray-300 transition-colors">
          Novedades
        </li>
        <li className="cursor-pointer font-medium hover:text-gray-300 transition-colors">
          Contáctanos
        </li>
        
        {/* BOTÓN INICIAR SESIÓN: 
            Ahora es del mismo gris, pero con un borde y un 'hover' 
            un poco más claro para que sepa que es un botón.
        */}
        <li 
          onClick={alClickLogin} 
          className="cursor-pointer font-bold bg-white/10 px-4 py-1 rounded-lg hover:bg-white/20 transition-all active:scale-95 "
        >
          Iniciar sesión
        </li>
      </ul>
    </nav>
  );
}