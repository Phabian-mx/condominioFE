export default function BarraNavegacion() {
  return (
    <nav className="fixed top-6 right-6 z-50">
      {/* He cambiado bg-[#4179d3] por bg-slate-700/80 para el gris con transparencia.
        Agregué backdrop-blur-md para que se vea elegante sobre la foto.
      */}
      <ul className="flex flex-row items-center gap-8 bg-slate-700/80 backdrop-blur-md px-10 py-3 rounded-full text-white shadow-2xl list-none m-0">
        <li className="cursor-pointer font-medium hover:text-gray-300 transition-colors">
          Inicio
        </li>
        <li className="cursor-pointer font-medium hover:text-gray-300 transition-colors">
          Novedades
        </li>
        <li className="cursor-pointer font-medium hover:text-gray-300 transition-colors">
          Contáctanos
        </li>
        
        
        <li className="cursor-pointer font-medium hover:text-gray-300 transition-colors">
          Iniciar sesión
        </li>
      </ul>
    </nav>
  );
}