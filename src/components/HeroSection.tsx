import { Button } from "@/components/ui/button";
import { StarField } from "./StarField";
import heroImage from "@/assets/shining-stone-hero.jpg";
import { Sparkles, MapPin } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center starfield overflow-hidden">
      <StarField />
      
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background/90" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Magical Title */}
        <div className="mb-8 sm:mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-4 stellar-text leading-tight">
            Shining Stone
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary animate-pulse" />
            <p className="text-lg sm:text-xl lg:text-2xl text-secondary/90 font-light">
              Discover magical places under moonlight
            </p>
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary animate-pulse" />
          </div>
        </div>

        {/* Description */}
        <div className="mb-8 sm:mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Find enchanted stones where couples gather under starlit skies. 
            Connect with kindred spirits and create unforgettable moments in nature's most romantic settings.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Button 
            size="lg" 
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow px-8 py-4 text-lg font-semibold animate-glow"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Enter the Magic
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full sm:w-auto border-secondary/30 text-secondary hover:bg-secondary/10 px-8 py-4 text-lg"
          >
            Learn More
          </Button>
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