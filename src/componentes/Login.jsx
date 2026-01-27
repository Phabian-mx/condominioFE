import { useState } from 'react';

export default function Login({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // Evitamos que la página se recargue sola
    
    // VALIDACIÓN SIMPLE: Si es admin y clave 1234, entra como jefe
    if (user.trim() === "admin" && pass === "1234") {
      onLogin("admin"); 
    } else if (user.trim()) {
      // Si pone un número, entra como vecino (ej: depto 101)
      onLogin(user); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-200 p-8 rounded-lg flex flex-col gap-4">
      {/* 'onChange' guarda lo que escribes en las variables 'user' y 'pass' */}
      <input placeholder="Usuario" onChange={(e) => setUser(e.target.value)} />
      <input type="password" placeholder="Clave" onChange={(e) => setPass(e.target.value)} />
      <button className="bg-slate-800 text-white p-2 rounded">ENTRAR</button>
    </form>
  );
}