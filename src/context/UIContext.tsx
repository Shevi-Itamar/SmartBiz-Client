// src/context/UIContext.tsx
import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface UIContextType {
  showLoginForm: boolean;
  setShowLoginForm: (value: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [showLoginForm, setShowLoginForm] = useState(false);

  return (
    <UIContext.Provider value={{ showLoginForm, setShowLoginForm }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
