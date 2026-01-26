export default function BarraNavegacion() {
  return (
    <nav className="fixed top-6 right-6 z-50">
      <ul className="flex flex-row items-center gap-6 bg-[#4179d3] px-8 py-3 rounded-2xl text-white shadow-2xl list-none m-0">
        <li className="cursor-pointer hover:opacity-80">Inicio</li>
        <li className="cursor-pointer hover:opacity-80">Novedades</li>
        <li className="cursor-pointer hover:opacity-80">Contáctanos</li>
        <li className="cursor-pointer bg-white/20 px-4 py-1 rounded-lg">Iniciar sesión</li>
      </ul>
    </nav>
  );
}