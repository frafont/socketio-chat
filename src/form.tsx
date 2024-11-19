import React, { useState } from "react";
import { sendUserData } from "./socket"; // Funzione per inviare i dati al backend

const Form = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState(""); // Data di nascita

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validazione dei dati
    if (name && surname && email && dob) {
      const userData = {
        name,
        surname,
        email,
        dob,
      };
      sendUserData(userData); // Invia i dati dell'utente
    } else {
      alert("Per favore, compila tutti i campi.");
    }
  };

  return (
    <div>
      <h2>Registrazione Utente</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Cognome"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Data di nascita"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
        />
        <button type="submit">Registrati</button>
      </form>
    </div>
  );
};

export default Form;
