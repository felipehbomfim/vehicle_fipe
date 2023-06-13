import React, { createContext, useState } from 'react';

// Cria o contexto
const UserTypeContext = createContext();

// Provedor do contexto
const UserTypeProvider = ({ children }) => {
  const [userType, setUserType] = useState(null);

  // Define uma função para atualizar o tipo de usuário
  const updateUserType = (type) => {
    setUserType(type);
  };

  // Retorna o provedor do contexto com o valor atualizado
  return (
    <UserTypeContext.Provider value={{ userType, updateUserType }}>
      {children}
    </UserTypeContext.Provider>
  );
};

export { UserTypeContext, UserTypeProvider };