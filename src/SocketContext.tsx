import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

const newSocket = io('http://10.200.200.6:3000', {transports: ["websocket"], autoConnect:true}); // Assicurati che l'URL corrisponda all'IP del backend


export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);


  useEffect(() => {
    console.log('Tentativo di connessione al server...'); // Log per debug

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to the server!');
    });

    return () => {
      newSocket.disconnect();
      console.log('Socket disconnected');
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
