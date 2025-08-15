import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { StarryTitle } from "./StarryTitle";
import { ShiningStone } from "./ShiningStone";
import { ParallaxSection } from "./ParallaxSection";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslations } from 'next-intl';

interface NewHeroSectionProps {
  locale: string;
  onLocaleChange: (locale: string) => void;
}

export const NewHeroSection = ({ locale, onLocaleChange }: NewHeroSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const t = useTranslations('hero');

  const handleEnterMagic = () => {
    // Navigate to main app
    console.log("Entering the magic...");
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Language Switcher */}
      <LanguageSwitcher currentLocale={locale} onLocaleChange={onLocaleChange} />

      {/* Main Hero Section */}
      <motion.section 
        className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden"
        style={{ y, opacity }}
      >
        {/* Starfield Background */}
        <div className="absolute inset-0">
          <div className="starfield w-full h-full" />
          
          {/* Additional star layers for depth */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-primary/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Upper half - Starry title */}
        <div className="absolute top-0 left-0 right-0 h-1/2 flex items-center justify-center">
          <StarryTitle text={t('title')} />
        </div>

        {/* Center description */}
        <motion.div
          className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto mt-32"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <p className="text-lg sm:text-xl text-secondary/90 font-light mb-8 leading-relaxed">
            {t('subtitle')}
          </p>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </motion.div>

        {/* Lower half - Shining Stone with couple */}
        <div className="absolute bottom-20 left-0 right-0 flex items-center justify-center">
          <ShiningStone buttonText={t('enterButton')} onEnter={handleEnterMagic} />
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-secondary/40 rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-3 bg-secondary/60 rounded-full mt-2"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section with Parallax */}
      <ParallaxSection />
    </div>
  );
};