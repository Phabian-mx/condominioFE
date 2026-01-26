import BarraNavegacion from "./componentes/BarraNavegacion";
import Portada from "./componentes/Portada";

function App() {
  return (
    // 'h-screen' asegura que el contenedor mida toda la pantalla
    <main className="relative h-screen w-full">
      <BarraNavegacion />
      <Portada />
    </main>
  );
}

export default App;