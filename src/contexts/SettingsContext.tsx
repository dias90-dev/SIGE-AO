import React, { createContext, useContext, useState, useEffect } from 'react';

interface SchoolInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
  logo: string | null;
}

interface SettingsContextType {
  info: SchoolInfo;
  updateInfo: (newInfo: SchoolInfo) => void;
  isLoading: boolean;
}

const defaultInfo: SchoolInfo = {
  name: 'Instituto Médio Politécnico SIGE',
  address: 'Av. Pedro de Castro Van-Dúnem, Luanda, Angola',
  phone: '+244 923 000 000',
  email: 'direccao@escola.ao',
  website: 'www.escola.sige.ao',
  taxId: '5410000000',
  logo: null,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [info, setInfo] = useState<SchoolInfo>(defaultInfo);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem('sige_school_info');
    if (cached) {
      try {
        setInfo(JSON.parse(cached));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    setIsLoading(false);
  }, []);

  const updateInfo = (newInfo: SchoolInfo) => {
    setInfo(newInfo);
    localStorage.setItem('sige_school_info', JSON.stringify(newInfo));
  };

  return (
    <SettingsContext.Provider value={{ info, updateInfo, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
