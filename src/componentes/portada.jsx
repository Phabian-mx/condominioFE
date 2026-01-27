export default function Portada() {
  return (
    // 'fixed inset-0' hace que la imagen tape toda la pantalla
    // '-z-10' la manda al fondo de todo para que no estorbe a los botones
    <div className="fixed inset-0 -z-10 w-full h-full bg-slate-900"> 
      <img 
        src="/img/inicio/portada.jpg" 
        className="w-full h-full object-cover" 
        alt="Fondo"
      />
    </div>
  );
}