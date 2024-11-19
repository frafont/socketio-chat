import React, { useState } from 'react';
import { useSocket } from './SocketContext';  // Importa il hook per ottenere il socket

interface LoginProps {
  onLogin: (userData: { email: string; name: string; surname: string; birth: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const socket = useSocket();  // Ottieni il socket dal contesto
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [birth, setBirth] = useState<string>('');
  const [error, setError] = useState<string | null>(null); // Stato per gestire errori

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validazione dei campi
    if (!email.trim() || !name.trim() || !surname.trim() || !birth.trim()) {
      setError('Tutti i campi sono obbligatori!');
      return;
    }

    if (!socket) {
      setError('Connessione al server non disponibile.');
      return;
    }

    // Crea l'oggetto userData
    const userData = { email, name, surname, birth };
    
    // Passa i dati al componente genitore tramite la funzione onLogin
    onLogin(userData);

    // Invia i dati al backend tramite Socket.IO
    socket.emit('submitUserData', userData, (response: { success: boolean; message: string }) => {
      if (response.success) {
        console.log('Dati inviati con successo:', response.message);
        setError(null); // Rimuovi eventuali errori precedenti
      } else {
        setError(`Errore nell’invio dei dati: ${response.message}`);
      }
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Inserisci i tuoi dati</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mostra errori, se presenti */}
        <input
          type="text"
          id="nome"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: '0.5rem' }}
        />
        <input
          type="text"
          id="cognome"
          placeholder="Cognome"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          style={{ marginBottom: '0.5rem' }}
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: '0.5rem' }}
        />
        <input
          type="date"
          id="dataDiNascita"
          placeholder="Data di Nascita"
          value={birth}
          onChange={(e) => setBirth(e.target.value)}
          style={{ marginBottom: '0.5rem' }}
        />
        <button type="submit">Accedi</button>
      </form>
    </div>
  );
};

export default Login;