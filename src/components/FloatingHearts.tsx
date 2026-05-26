import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

export function FloatingHearts() {
  const [hearts, setHearts] = useState<{ id: number; left: string; delay: number; size: number }[]>([]);

  useEffect(() => {
    // Generate some random hearts
    const newHearts = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
      size: Math.random() * 20 + 20, // 20px to 40px
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute bottom-[-10%]"
          initial={{ opacity: 0, y: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.5, 0],
            y: ["0vh", "-100vh"],
            scale: [1, 1.2, 1],
            rotate: [0, Math.random() * 45 - 22.5, Math.random() * -45 + 22.5, 0]
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: heart.delay,
            ease: "linear",
          }}
          style={{ left: heart.left }}
        >
          <Heart
            className="text-pink-300/40 fill-pink-300/40"
            style={{ width: heart.size, height: heart.size }}
          />
        </motion.div>
      ))}
    </div>
  );
}
