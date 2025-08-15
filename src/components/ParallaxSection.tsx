import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FeatureCard } from "./FeatureCard";
import { MapPin, Star, Users, Eye } from "lucide-react";
import { useTranslations } from 'next-intl';

export const ParallaxSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const t = useTranslations('features');

  const features = [
    {
      icon: MapPin,
      title: t('discover.title'),
      description: t('discover.description'),
    },
    {
      icon: Star,
      title: t('reviews.title'),
      description: t('reviews.description'),
    },
    {
      icon: Eye,
      title: t('busy.title'),
      description: t('busy.description'),
    },
    {
      icon: Users,
      title: t('meet.title'),
      description: t('meet.description'),
    },
  ];

  return (
    <motion.section
      ref={ref}
      className="min-h-screen py-20 px-4 relative"
      style={{ y, opacity }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 stellar-text">
            {t('title')}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
};