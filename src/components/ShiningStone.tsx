import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface ShiningStoneProps {
  buttonText: string;
  onEnter: () => void;
}

export const ShiningStone = ({ buttonText, onEnter }: ShiningStoneProps) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* The Shining Stone */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        {/* Stone Base */}
        <div className="relative w-80 h-40 rounded-full bg-gradient-to-t from-gray-800 to-gray-600 shadow-2xl">
          {/* Stone texture */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-gray-700/30 to-gray-900/50" />
          
          {/* Magical Glow */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'var(--gradient-stone-glow)',
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Central bright spot */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-10 rounded-full bg-primary/40 blur-sm"
            animate={{
              opacity: [0.4, 0.9, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* The Couple Sitting */}
          <motion.div 
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex items-end gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            {/* Person 1 - Simple silhouette */}
            <div className="w-8 h-16 relative">
              {/* Head */}
              <div className="w-6 h-6 rounded-full bg-foreground/80 mx-auto mb-1" />
              {/* Body */}
              <div className="w-4 h-10 bg-foreground/80 mx-auto rounded-sm" />
            </div>
            
            {/* Person 2 - Simple silhouette */}
            <div className="w-8 h-16 relative">
              {/* Head */}
              <div className="w-6 h-6 rounded-full bg-foreground/80 mx-auto mb-1" />
              {/* Body */}
              <div className="w-4 h-10 bg-foreground/80 mx-auto rounded-sm" />
            </div>
          </motion.div>

          {/* Enter the Magic Button */}
          <motion.div
            className="absolute -bottom-16 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <Button 
              size="lg" 
              onClick={onEnter}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow px-8 py-4 text-lg font-semibold animate-glow relative z-10"
            >
              <MapPin className="w-5 h-5 mr-2" />
              {buttonText}
            </Button>
          </motion.div>

          {/* Light rays emanating from the stone */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-0.5 bg-gradient-to-t from-primary/60 to-transparent origin-bottom"
              style={{
                height: '60px',
                transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
              }}
              animate={{
                opacity: [0.2, 0.6, 0.2],
                scaleY: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3 + (i * 0.3),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};