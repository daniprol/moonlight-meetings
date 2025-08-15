import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Locale = 'en' | 'es' | 'gl';

interface Messages {
  title: string;
  subtitle: string;
  description: string;
  enterMagic: string;
  learnMore: string;
}

interface LanguageContextType {
  locale: Locale;
  messages: Messages;
  setLocale: (locale: Locale) => void;
}

const translations: Record<Locale, Messages> = {
  en: {
    title: "Shining Stone",
    subtitle: "Discover magical places under moonlight",
    description: "Find enchanted stones where couples gather under starlit skies. Connect with kindred spirits and create unforgettable moments in nature's most romantic settings.",
    enterMagic: "Enter the Magic",
    learnMore: "Learn More"
  },
  es: {
    title: "Piedra Brillante",
    subtitle: "Descubre lugares mágicos bajo la luz de la luna",
    description: "Encuentra piedras encantadas donde las parejas se reúnen bajo cielos estrellados. Conecta con almas afines y crea momentos inolvidables en los entornos más románticos de la naturaleza.",
    enterMagic: "Entrar en la Magia",
    learnMore: "Saber Más"
  },
  gl: {
    title: "Pedra que Alumbra",
    subtitle: "Descobre lugares máxicos baixo a luz da lúa",
    description: "Atopa pedras encantadas onde as parellas se xuntan baixo ceos estrelados. Conecta con almas xemelgas e crea momentos inesquecibles nos entornos máis románticos da natureza.",
    enterMagic: "Entrar na Maxia",
    learnMore: "Saber Máis"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && translations[savedLocale]) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const messages = translations[locale];

  return (
    <LanguageContext.Provider value={{ locale, messages, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};