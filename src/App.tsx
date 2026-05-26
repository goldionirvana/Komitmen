/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { Heart, Volume2, VolumeX } from "lucide-react";
import { FloatingHearts } from "./components/FloatingHearts";
import { Envelope } from "./components/Envelope";
import { SignaturePad } from "./components/SignaturePad";

type Step = 'envelope' | 'question' | 'contract' | 'celebration';

export default function App() {
  const [step, setStep] = useState<Step>('envelope');
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const attemptPlayMusic = () => {
    if (!hasInteracted && audioRef.current) {
      setHasInteracted(true);
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log("Audio autoplay failed. Play manually.", err);
        setHasInteracted(false); // Allow retrying if it failed
      });
    }
  };

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log(e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleOpenEnvelope = () => {
    attemptPlayMusic();
    setIsEnvelopeOpen(true);
    setTimeout(() => {
      setStep('question');
    }, 1500);
  };

  const handleNoHover = () => {
    attemptPlayMusic();
    if (!containerRef.current || !noButtonRef.current) return;
    
    // Increase no counter to make the "Yes" button larger
    setNoCount(prev => prev + 1);

    const container = containerRef.current.getBoundingClientRect();
    const btn = noButtonRef.current.getBoundingClientRect();
    
    const maxX = container.width - btn.width - 40;
    const maxY = container.height - btn.height - 40;
    
    // Generate random positions
    const randomX = Math.random() * (maxX / 2) * (Math.random() > 0.5 ? 1 : -1);
    const randomY = Math.random() * (maxY / 2) * (Math.random() > 0.5 ? 1 : -1);

    setNoPosition({ x: randomX, y: randomY });
  };

  const handleYesClick = () => {
    attemptPlayMusic();
    setStep('contract');
  };

  const handleSignComplete = () => {
    setHasSigned(true);
  };

  const handleContractAgreed = () => {
    triggerConfetti();
    setStep('celebration');
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ffb7b2', '#ff9a9e', '#fecfef']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ffb7b2', '#ff9a9e', '#fecfef']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    
    // Also a big burst in the middle
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#ff0055', '#ff9a9e', '#ffb7b2']
    });

    frame();
  };

  // Grow "Yes" button based on how many times "No" was hovered
  const yesButtonScale = 1 + (noCount * 0.1);

  return (
    <div 
      ref={containerRef}
      onPointerDown={attemptPlayMusic}
      className="min-h-screen w-full bg-pink-50 relative overflow-hidden flex flex-col items-center justify-center p-4 font-sans text-gray-800"
    >
      {/* Background Music Audio Element - Link to a generic romantic piano track */}
      {/* Note: You can replace the src URL with your own romantic song link or file path! */}
      <audio 
        ref={audioRef} 
        src="https://upload.wikimedia.org/wikipedia/commons/transcoded/b/be/Clair_de_lune_%28Claude_Debussy%29_Suite_bergamasque.ogg/Clair_de_lune_%28Claude_Debussy%29_Suite_bergamasque.ogg.mp3" 
        loop
        preload="auto"
      />
      
      {/* Music Toggle Button */}
      <button 
        onClick={toggleMusic}
        className="absolute top-4 right-4 z-50 bg-white/80 backdrop-blur p-3 rounded-full shadow-lg text-rose-500 hover:bg-rose-50 transition-colors"
        aria-label="Toggle music"
      >
        {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      <FloatingHearts />
      
      <AnimatePresence mode="popLayout" initial={false}>
        {step === 'envelope' && (
          <motion.div
            key="envelope-view"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2, transition: { duration: 0.5 } }}
            className="flex flex-col items-center z-10"
          >
            <h2 className="text-3xl font-cursive text-rose-500 mb-12 animate-pulse text-center">
              Ada pesan untuk Aliyah...
            </h2>
            <Envelope isOpen={isEnvelopeOpen} onClick={handleOpenEnvelope} />
            <p className="mt-12 text-rose-400 font-medium">Buka amplopnya ya sayang 💌</p>
          </motion.div>
        )}

        {step === 'question' && (
          <motion.div
            key="question-view"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="flex flex-col items-center max-w-xl z-10 w-full mt-8"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="mb-8"
            >
              <Heart className="w-24 h-24 text-rose-400 fill-rose-200 shadow-[0_10px_20px_rgba(244,63,94,0.3)] shadow-rose-200 rounded-full" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl text-center font-cursive text-rose-500 mb-12 leading-tight">
              Aliyah, maukah kamu terus berjalan bersama Goldio selamanya?
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 w-full min-h-[100px] mt-4">
              <motion.button
                onClick={handleYesClick}
                animate={{ scale: yesButtonScale }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl hover:shadow-rose-400/50 shadow-rose-400/30 transition-shadow whitespace-nowrap text-xl"
                style={{ zIndex: 20 }}
              >
                Mau banget!
              </motion.button>

              <motion.button
                ref={noButtonRef}
                onMouseEnter={handleNoHover}
                onClick={handleNoHover}
                animate={{ x: noPosition.x, y: noPosition.y }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-500 font-semibold py-4 px-10 rounded-full shadow-md whitespace-nowrap text-xl border border-gray-200"
                style={{ position: 'relative', zIndex: 10 }}
              >
                Nggak
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 'contract' && (
          <motion.div
            key="contract-view"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="flex flex-col items-center bg-white/95 backdrop-blur-md p-6 md:p-12 rounded-2xl shadow-2xl shadow-rose-200/60 z-10 max-w-2xl w-full mx-4 border-8 border-double border-rose-100"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-rose-700 mb-4 text-center uppercase tracking-widest font-bold">
              Surat Komitmen Cinta
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-rose-300 to-transparent mb-10 rounded-full" />
            
            <div className="text-lg md:text-xl text-gray-700 leading-relaxed font-sans mb-10 text-left w-full space-y-5">
              <p className="italic text-gray-500 text-center mb-6">Dengan ini, menyatakan bahwa:</p>
              
              <div className="bg-rose-50/80 p-5 rounded-xl border border-rose-200/60 shadow-inner">
                <p className="mb-2"><span className="text-rose-400 font-bold w-24 inline-block">Nama:</span> <span className="font-semibold text-gray-800">Aliyah Nur Fadhia</span></p>
                <p><span className="text-rose-400 font-bold w-24 inline-block">Status:</span> <span className="font-semibold text-pink-600">Teristimewa & Satu-satunya ❤️</span></p>
              </div>
              
              <p className="text-center font-medium px-4 leading-relaxed mt-6">
                Telah setuju dan berjanji sepenuh hati untuk terus berjalan berdampingan, saling menyayangi, dan menghabiskan waktu bersama <span className="text-rose-600 font-bold">Goldio Ihza Perwira Nirvana</span> untuk selamanya.
              </p>
            </div>

            <div className="flex flex-row justify-between w-full mt-4 mb-10">
              <div className="flex flex-col items-center w-5/12">
                <p className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">Pihak Pertama</p>
                <div className="h-32 flex flex-col items-center justify-end w-full">
                  <div className="flex items-center justify-center h-full w-full">
                    <span className="font-cursive text-5xl text-rose-600 -rotate-6 select-none opacity-90 drop-shadow-sm">Goldio</span>
                  </div>
                  <div className="w-full border-t-2 border-dashed border-gray-300 pt-2 text-center mt-2">
                    <p className="font-bold text-gray-800">Goldio I. P. N.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-end w-2/12 pb-8">
                <Heart className="w-8 h-8 text-rose-200 fill-rose-200 animate-pulse" />
              </div>

              <div className="flex flex-col items-center w-5/12">
                <p className="text-sm font-medium text-rose-400 mb-2 uppercase tracking-wide">Pihak Kedua (Aliyah)</p>
                <div className="w-full flex justify-center h-32 flex-col items-center">
                  <SignaturePad onSign={handleSignComplete} />
                  <div className="w-full border-t-2 border-dashed border-gray-300 pt-2 text-center mt-2">
                    <p className="font-bold text-gray-800">Aliyah Nur Fadhia</p>
                  </div>
                </div>
              </div>
            </div>

            <motion.button
              disabled={!hasSigned}
              onClick={handleContractAgreed}
              whileHover={hasSigned ? { scale: 1.05 } : {}}
              whileTap={hasSigned ? { scale: 0.95 } : {}}
              className={`w-full py-5 rounded-2xl font-bold text-xl shadow-lg transition-all ${
                hasSigned 
                  ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:shadow-rose-400/50 hover:from-rose-600 hover:to-pink-600" 
                  : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
              }`}
            >
              {hasSigned ? "Selesai & Setuju ❤️" : "Tanda Tangan Dulu Ya ~"}
            </motion.button>
          </motion.div>
        )}

        {step === 'celebration' && (
          <motion.div
            key="celebration-view"
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.5, duration: 1 }}
            className="flex flex-col items-center bg-white/90 backdrop-blur-md p-10 md:p-14 rounded-3xl shadow-2xl shadow-rose-200/80 z-10 max-w-xl text-center mx-4 border border-rose-100"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.1, 1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="mb-8 flex gap-3 object-center justify-center items-center"
            >
              <Heart className="w-12 h-12 text-rose-500 fill-rose-500" />
              <Heart className="w-20 h-20 text-pink-400 fill-pink-400 drop-shadow-[0_0_15px_rgba(244,114,182,0.5)]" />
              <Heart className="w-12 h-12 text-rose-500 fill-rose-500" />
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-cursive text-rose-600 mb-8 leading-tight">
              Yeay! Berhasil! 💍✨
            </h2>
            <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 text-rose-900 mb-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium mb-4">
                Officially kita wajib jaga komitmen ini ya, karena kamu udah setuju dengan tanda tangan tadi hihihi...
              </p>
              <p className="text-md text-pink-600 font-semibold font-sans">
                Goldio janji bakal selalu ada dan bikin Aliyah bahagia. I love you endlessly! ❤️
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}