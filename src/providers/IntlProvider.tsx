import { ReactNode, useEffect, useState } from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';
import { useLocale } from '@/hooks/useLocale';

interface IntlProviderProps {
  children: ReactNode;
}

export const IntlProvider = ({ children }: IntlProviderProps) => {
  const { locale } = useLocale();
  const [messages, setMessages] = useState<any>(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const messageModule = await import(`../messages/${locale}.json`);
        setMessages(messageModule.default);
      } catch (error) {
        console.error('Failed to load messages:', error);
        // Fallback to English
        const fallbackModule = await import('../messages/en.json');
        setMessages(fallbackModule.default);
      }
    };

    loadMessages();
  }, [locale]);

  if (!messages) {
    return <div>Loading...</div>;
  }

  return (
    <ReactIntlProvider locale={locale} messages={messages}>
      {children}
    </ReactIntlProvider>
  );
};