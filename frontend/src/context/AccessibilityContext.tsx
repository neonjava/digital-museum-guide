import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type TextSize = 'normal' | 'large' | 'xlarge';

interface AccessibilityContextType {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  toggleHighContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [textSize, setTextSize] = useState<TextSize>(
    (localStorage.getItem('museum_text_size') as TextSize) || 'normal'
  );
  const [highContrast, setHighContrast] = useState<boolean>(
    localStorage.getItem('museum_high_contrast') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('museum_text_size', textSize);
    const root = document.documentElement;
    root.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge');
    root.classList.add(`text-size-${textSize}`);
  }, [textSize]);

  useEffect(() => {
    localStorage.setItem('museum_high_contrast', String(highContrast));
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const toggleHighContrast = () => {
    setHighContrast((prev) => !prev);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        textSize,
        setTextSize,
        highContrast,
        setHighContrast,
        toggleHighContrast,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
