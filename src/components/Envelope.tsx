import { motion } from "motion/react";
import { Heart } from "lucide-react";

export function Envelope({ onClick, isOpen }: { onClick?: () => void, isOpen: boolean }) {
  return (
    <div className="relative w-80 h-56 cursor-pointer" style={{ perspective: '1200px' }} onClick={onClick}>
      <motion.div 
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ y: isOpen ? 0 : [0, -10, 0] }}
        transition={{ repeat: isOpen ? 0 : Infinity, duration: 3, ease: "easeInOut" }}
        whileHover={!isOpen ? { scale: 1.05 } : {}}
        whileTap={!isOpen ? { scale: 0.95 } : {}}
      >
        {/* Back of Envelope */}
        <div className="absolute inset-0 bg-rose-400 rounded-xl shadow-2xl" />
        
        {/* Letter sliding up */}
        <motion.div 
          className="absolute left-6 right-6 bg-white rounded-lg shadow-md flex flex-col items-center p-6 border border-rose-100"
          initial={{ top: "10%", bottom: "10%" }}
          animate={{ 
            top: isOpen ? "-50%" : "10%", 
            bottom: isOpen ? "100%" : "10%", 
            opacity: isOpen ? 0 : 1 
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{ zIndex: 10 }}
        >
          <Heart className="w-8 h-8 text-rose-300 mb-4" />
          <div className="w-full h-2 bg-rose-100 rounded-full mb-3" />
          <div className="w-5/6 h-2 bg-rose-100 rounded-full mb-3" />
          <div className="w-4/6 h-2 bg-rose-100 rounded-full" />
        </motion.div>

        {/* Front Flaps (Left, Right, Bottom) */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
          {/* Bottom flap */}
          <div className="absolute bottom-0 left-0 right-0 h-[65%] bg-rose-500 rounded-b-xl shadow-[0_-2px_10px_rgba(0,0,0,0.1)]" style={{ clipPath: "polygon(0 100%, 100% 100%, 50% 0)" }} />
          {/* Left flap */}
          <div className="absolute inset-0 bg-rose-400 rounded-xl opacity-90 shadow-[2px_0_10px_rgba(0,0,0,0.1)]" style={{ clipPath: "polygon(0 0, 0 100%, 50% 50%)" }} />
          {/* Right flap */}
          <div className="absolute inset-0 bg-rose-400 rounded-xl opacity-90 shadow-[-2px_0_10px_rgba(0,0,0,0.1)]" style={{ clipPath: "polygon(100% 0, 100% 100%, 50% 50%)" }} />
        </div>

        {/* Top Flap (Animated opening) */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-[65%] bg-rose-500 rounded-t-xl"
          style={{ 
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            transformOrigin: "top",
            zIndex: isOpen ? 5 : 25
          }}
          initial={{ rotateX: 0 }}
          animate={{ rotateX: isOpen ? 180 : 0, zIndex: isOpen ? 5 : 25 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Wax Seal */}
        <motion.div 
          className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-rose-600 flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.2)] border-2 border-rose-400"
          style={{ zIndex: isOpen ? 5 : 30 }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ 
            opacity: isOpen ? 0 : 1,
            scale: isOpen ? 1.5 : 1
          }}
          transition={{ duration: 0.5 }}
        >
          <Heart className="w-8 h-8 text-white fill-white drop-shadow-md" />
        </motion.div>
      </motion.div>
    </div>
  );
}
