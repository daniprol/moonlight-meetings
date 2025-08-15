import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from 'next-intl';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'gl', name: 'Galego', flag: '🏴󠁥󠁳󠁧󠁡󠁿' }
];

interface LanguageSwitcherProps {
  currentLocale: string;
  onLocaleChange: (locale: string) => void;
}

export const LanguageSwitcher = ({ currentLocale, onLocaleChange }: LanguageSwitcherProps) => {
  const t = useTranslations('language');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="fixed top-4 right-4 z-50 bg-black/20 backdrop-blur-sm border border-primary/20 hover:bg-primary/10 text-primary"
        >
          <Globe className="w-4 h-4 mr-2" />
          {languages.find(lang => lang.code === currentLocale)?.flag}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-black/90 backdrop-blur-sm border-primary/20"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => onLocaleChange(language.code)}
            className="text-foreground hover:bg-primary/20 focus:bg-primary/20 cursor-pointer"
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};