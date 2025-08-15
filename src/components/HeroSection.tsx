import { Button } from "@/components/ui/button";
import { StarField } from "./StarField";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@/assets/shining-stone-hero.jpg";
import { Sparkles, MapPin } from "lucide-react";

export const HeroSection = () => {
  const { messages } = useLanguage();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center starfield overflow-hidden">
      <StarField />
      <LanguageSwitcher />
      
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background/90" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between min-h-screen px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Top Section - Title and Subtitle */}
        <div className="text-center pt-16 sm:pt-20 lg:pt-24">
          <div className="animate-fade-in">
            <h1 className="text-5xl sm:text-7xl lg:text-9xl font-orbitron font-bold mb-4 stellar-text leading-tight tracking-wider">
              {messages.title}
            </h1>
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary animate-pulse" />
              <p className="text-lg sm:text-xl lg:text-2xl text-secondary/90 font-light">
                {messages.subtitle}
              </p>
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary animate-pulse" />
            </div>
          </div>
        </div>

        {/* Bottom Section - Description and Buttons */}
        <div className="text-center pb-24 sm:pb-28 space-y-6 sm:space-y-8">
          {/* Description */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {messages.description}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-primary/50 hover:border-primary transition-all duration-300 px-8 py-4 text-lg font-semibold"
            >
              <MapPin className="w-5 h-5 mr-2" />
              {messages.enterMagic}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto border-secondary/30 text-secondary hover:bg-secondary/10 px-8 py-4 text-lg"
            >
              {messages.learnMore}
            </Button>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/60 rounded-full animate-float hidden sm:block" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-secondary/80 rounded-full animate-twinkle hidden sm:block" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-accent/40 rounded-full animate-pulse hidden sm:block" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-secondary/40 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-secondary/60 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};