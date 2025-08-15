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
      
      {/* Content Container */}
      <div className="relative z-10 flex flex-col justify-between h-screen px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        
        {/* Magical Title at Top */}
        <div className="flex-1 flex items-start justify-center pt-16 sm:pt-20 animate-fade-in">
          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-bold stellar-text leading-tight text-center tracking-wider">
            Shining Stone
          </h1>
        </div>

        {/* Subtitle and Buttons at Bottom */}
        <div className="pb-20 sm:pb-24 text-center space-y-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-lg sm:text-xl lg:text-2xl text-secondary/90 font-light">
            Discover magical places under moonlight
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/60 rounded-full animate-float hidden sm:block" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-secondary/80 rounded-full animate-twinkle hidden sm:block" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-accent/40 rounded-full animate-pulse hidden sm:block" style={{ animationDelay: '1.5s' }} />

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-secondary/40 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-secondary/60 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};