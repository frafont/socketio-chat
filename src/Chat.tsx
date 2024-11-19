import React, { useEffect, useState } from 'react';
import { useSocket } from './SocketContext';  // Importa il hook per ottenere il socket

interface Message {
  id: string;
  text: string;
}

interface UserData {
  email: string;
  name: string;
  surname: string;
  birth: string;
}

interface ChatProps {
  userData: UserData;
}

const Chat: React.FC<ChatProps> = ({ userData }) => {
  const socket = useSocket();  // Ottieni il socket dal contesto
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    if (!socket) {
      console.log("Socket non disponibile.");
      return
    }
    if (!socket) return;

    console.log("Connected to the server!");

    // Listener per i messaggi di chat
    socket.on('chat message', (msg: string) => {
      console.log('Messaggio di chat ricevuto dal server:', msg);
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now().toString(), text: msg },
      ]);
    });

    // Listener per l'evento di connessione utente
    socket.on('user connected', (msg: string) => {
      console.log('User connected:', msg);
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now().toString(), text: `🔵 ${msg}` },
      ]);
    });

    // Listener per l'evento di disconnessione utente
    socket.on('user disconnected', (msg: string) => {
      console.log('User disconnected:', msg);
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now().toString(), text: `🔴 ${msg}` },
      ]);
    });

    // Cleanup alla disconnessione del socket
    return () => {
      socket.off('chat message');
      socket.off('user connected');
      socket.off('user disconnected');
    };
  }, [socket]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (socket && input) {
      const message = `${userData.name} ${userData.surname} (${userData.email}): ${input}`;
      socket.emit('chat message', message);
      setInput('');
      
      try {
        const response = await fetch('http://10.200.200.6:3000/api/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: input,
            timestamp: new Date().toISOString(),
          }),
        });

        if (response.ok) {
          console.log('Messaggio salvato nel database con successo');
        } else {
          console.error('Errore durante il salvataggio del messaggio');
        }
      } catch (error) {
        console.error('Errore di rete:', error);
      }
    }
  };

  return (
    <div>
      <h2>Chat App</h2>
      <p>Benvenuto, {userData.name} {userData.surname} (data di nascita: {userData.birth})</p>
      <div style={{ border: '1px solid #ccc', padding: '1rem', maxHeight: '300px', overflowY: 'scroll' }}>
        {messages.map((msg) => (
          <div key={msg.id}>{msg.text}</div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrivi un messaggio..."
          style={{ width: '80%', marginRight: '0.5rem' }}
        />
        <button type="submit">Invia</button>
      </form>
    </div>
  );
};

export default Chat;
