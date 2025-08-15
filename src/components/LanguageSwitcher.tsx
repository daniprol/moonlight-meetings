import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'gl', name: 'Galego', flag: '🏴󠁥󠁳󠁧󠁡󠁿' },
];

export const LanguageSwitcher = () => {
  const { locale, setLocale } = useLanguage();
  const currentLanguage = languages.find(lang => lang.code === locale);

  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="bg-background/10 backdrop-blur-sm border border-primary/20 hover:bg-primary/10 hover:border-primary/40 text-primary-foreground"
          >
            <Globe className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{currentLanguage?.name || 'English'}</span>
            <span className="sm:hidden">{currentLanguage?.flag || '🇺🇸'}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="bg-background/80 backdrop-blur-md border-primary/20"
        >
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => setLocale(language.code as 'en' | 'es' | 'gl')}
              className="hover:bg-primary/10 cursor-pointer"
            >
              <span className="mr-2">{language.flag}</span>
              {language.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};