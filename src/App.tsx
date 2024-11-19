import React, { useState } from 'react';
import Chat from './Chat';

import LoginForm from './form';

interface UserData {
  email: string;
  name: string;
  surname: string;
  birth: string;
}

const App: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleLogin = (userData: UserData) => {
    setUserData(userData);
  };

  return (
    <div className="App">
      <h1>My Chat App</h1>
      {userData ? (
        <Chat userData={userData} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;