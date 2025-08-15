import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  letter?: string;
}

interface StarryTitleProps {
  text: string;
  className?: string;
}

export const StarryTitle = ({ text, className = "" }: StarryTitleProps) => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      
      // Background stars
      for (let i = 0; i < 80; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 40, // Only in upper portion
          size: Math.random() * 2 + 0.5,
          delay: Math.random() * 4,
        });
      }
      
      // Title letter stars
      const letterPositions = [
        // Approximate positions for letters to form the title
        { x: 20, y: 15, letter: text[0] },
        { x: 25, y: 18, letter: text[1] },
        { x: 30, y: 15, letter: text[2] },
        { x: 35, y: 20, letter: text[3] },
        { x: 40, y: 17, letter: text[4] },
        { x: 45, y: 22, letter: text[5] },
        { x: 50, y: 19, letter: text[6] },
        { x: 55, y: 16, letter: text[7] },
        { x: 60, y: 21, letter: text[8] },
        { x: 65, y: 18, letter: text[9] },
        { x: 70, y: 15, letter: text[10] },
        { x: 75, y: 20, letter: text[11] },
        { x: 80, y: 17, letter: text[12] },
      ];

      letterPositions.forEach((pos, index) => {
        if (pos.letter && pos.letter !== ' ') {
          newStars.push({
            id: 1000 + index,
            x: pos.x,
            y: pos.y,
            size: 4,
            delay: index * 0.2,
            letter: pos.letter,
          });
        }
      });

      setStars(newStars);
    };

    generateStars();
  }, [text]);

  return (
    <div className={`relative h-48 w-full overflow-hidden ${className}`}>
      {/* Background Stars */}
      {stars.filter(star => !star.letter).map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-primary/60"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Letter Stars forming the title */}
      {stars.filter(star => star.letter).map((star) => (
        <motion.div
          key={star.id}
          className="absolute flex items-center justify-center"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: '20px',
            height: '20px',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0.8, 1],
            scale: [0, 1.5, 1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            delay: star.delay,
            ease: "easeOut",
          }}
        >
          <div className="relative">
            <div 
              className="text-primary font-bold text-lg drop-shadow-lg"
              style={{
                textShadow: '0 0 20px hsl(var(--primary)), 0 0 40px hsl(var(--primary))',
              }}
            >
              {star.letter}
            </div>
            <div 
              className="absolute inset-0 rounded-full bg-primary/20 blur-md"
              style={{
                width: '16px',
                height: '16px',
                left: '2px',
                top: '2px',
              }}
            />
          </div>
        </motion.div>
      ))}

      {/* Moon */}
      <motion.div
        className="absolute top-8 right-16 w-16 h-16 rounded-full bg-gradient-to-br from-secondary/80 to-secondary/40"
        style={{
          boxShadow: '0 0 30px hsl(var(--secondary) / 0.3), inset -8px -8px 0 hsl(var(--secondary) / 0.1)',
        }}
        animate={{
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Moon craters */}
        <div className="absolute top-4 left-3 w-2 h-2 rounded-full bg-secondary/20" />
        <div className="absolute top-8 left-8 w-1 h-1 rounded-full bg-secondary/30" />
        <div className="absolute bottom-6 left-6 w-1.5 h-1.5 rounded-full bg-secondary/25" />
      </motion.div>
    </div>
  );
};