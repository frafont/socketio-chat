import React, { useState, useEffect } from "react";
import { sendMessage, disconnectUser } from "./socket"; // Funzioni per inviare messaggi e gestire la disconnessione
import { io } from "socket.io-client";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState<string | null>(null); // chatId che verrà assegnato dopo la registrazione
  const [messages, setMessages] = useState<string[]>([]); // Per visualizzare i messaggi inviati

  useEffect(() => {
    // Connessione WebSocket
    const socket = io("http://localhost:3000");

    if (sessionStorage.getItem("chatId"))
      setChatId(sessionStorage.getItem("chatId"));

    // Ascolta per eventuali errori nel salvataggio dei messaggi
    socket.on(
      "messageReceived",
      (response: { status: string; message: string }) => {
        if (response.status === "success") {
          setMessages((prevMessages) => [...prevMessages, response.message]);
        }
      }
    );

    socket.on("messageError", (error: { message: string; error: string }) => {
      console.error("Errore nel salvataggio del messaggio:", error);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  const handleSendMessage = () => {
    if (message && chatId) {
      sendMessage(message, chatId); // Invia il messaggio al server tramite WebSocket
      setMessage(""); // Reset del campo messaggio
    } else {
      alert("Per favore, compila il messaggio.");
    }
  };

  const handleDisconnect = () => {
    if (chatId) {
      disconnectUser(chatId); // Disconnessione dell'utente
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      {chatId ? (
        <div>
          <div>
            <h3>Messaggi:</h3>
            <div>
              {messages.map((msg, index) => (
                <div key={index}>{msg}</div>
              ))}
            </div>
          </div>
          <div>
            <input
              type="text"
              placeholder="Scrivi un messaggio"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Invia</button>
          </div>
          <button onClick={handleDisconnect}>Disconnetti</button>
        </div>
      ) : (
        <p>Per iniziare, registrati nel modulo sopra.</p>
      )}
    </div>
  );
};

export default Chat;
