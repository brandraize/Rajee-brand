'use client';

import { createContext, useContext, useMemo, useState } from 'react';

const WizardContext = createContext(null);

export const usePostWizard = () => {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('usePostWizard must be used within PostWizardProvider');
  return ctx;
};

export default function PostWizardLayout({ children }) {
  const [type, setType] = useState('');
  const [agreed, setAgreed] = useState(false);

  const [city, setCity] = useState('');
  const [images, setImages] = useState([]);

  const value = useMemo(() => ({ type, setType, agreed, setAgreed,  city, setCity, images, setImages }), [type, agreed, city, images]);

  return (
    <WizardContext.Provider value={value}>
      {children}
    </WizardContext.Provider>
  );
}


