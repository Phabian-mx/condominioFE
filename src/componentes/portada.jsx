export default function Portada() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full">
      <img 
        src="/img/inicio/portada.jpg" 
        alt="Portada" 
        className="w-full h-full object-cover"
      />
    </div>
  );
}