import io from 'socket.io-client';

// Conectamos al puerto 4000 donde pusimos el backend
export const socket = io('http://localhost:4000');