import { NextIntlClientProvider } from 'next-intl';
import { ReactNode, useEffect, useState } from 'react';
import { Locale } from '@/lib/i18n';

interface IntlProviderProps {
  children: ReactNode;
  locale: Locale;
}

export const IntlProvider = ({ children, locale }: IntlProviderProps) => {
  const [messages, setMessages] = useState<any>(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const messages = await import(`../messages/${locale}.json`);
        setMessages(messages.default);
      } catch (error) {
        console.error('Failed to load messages:', error);
        // Fallback to English
        const fallbackMessages = await import('../messages/en.json');
        setMessages(fallbackMessages.default);
      }
    };

    loadMessages();
  }, [locale]);

  if (!messages) {
    return <div>Loading...</div>;
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
};