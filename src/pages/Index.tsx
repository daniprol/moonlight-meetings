import { NewHeroSection } from "@/components/NewHeroSection";
import { IntlProvider } from "@/providers/IntlProvider";
import { useLocale } from "@/hooks/useLocale";

const Index = () => {
  const { locale, changeLocale } = useLocale();

  return (
    <IntlProvider locale={locale}>
      <main className="relative bg-black min-h-screen">
        <NewHeroSection locale={locale} onLocaleChange={changeLocale} />
      </main>
    </IntlProvider>
  );
};

export default Index;
