import { motion } from "framer-motion";

/**
 * FloatingDecorations - Kawaii pixel art decorations scattered around the page
 * These decorative images add the 2005-2010 blog aesthetic
 */
export const FloatingDecorations = () => {
  return (
    <>
      {/* Top Left - Ribbon decoration */}
      <motion.img
        src="/pita.webp"
        alt=""
        className="fixed top-2 left-2 w-24 md:w-32 z-50 pointer-events-none select-none"
        initial={{ opacity: 0, rotate: -30 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />

      {/* Top Right - Computer decoration */}
      <motion.img
        src="/computer.webp"
        alt=""
        className="fixed top-4 right-4 w-16 md:w-20 z-50 pointer-events-none select-none opacity-80"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.8, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />

      {/* Left side - Camera floating */}
      <motion.img
        src="/kamera.webp"
        alt=""
        className="fixed top-1/3 left-2 w-12 md:w-16 z-40 pointer-events-none select-none opacity-70"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Right side - Cat decoration */}
      <motion.img
        src="/kucing.webp"
        alt=""
        className="fixed bottom-24 right-2 w-14 md:w-20 z-40 pointer-events-none select-none"
        animate={{
          y: [0, -5, 0],
          rotate: [0, 2, 0, -2, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Bottom Left - Book decoration */}
      <motion.img
        src="/book.webp"
        alt=""
        className="fixed bottom-20 left-2 w-10 md:w-14 z-40 pointer-events-none select-none opacity-80"
        animate={{
          rotate: [0, 5, 0, -5, 0]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Hearts scattered - love2 */}
      <motion.img
        src="/love2.webp"
        alt=""
        className="fixed top-1/2 left-8 w-10 md:w-12 z-30 pointer-events-none select-none opacity-60"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Hearts scattered - love3 near bottom */}
      <motion.img
        src="/love3.webp"
        alt=""
        className="fixed bottom-40 right-8 w-8 md:w-10 z-30 pointer-events-none select-none opacity-70"
        animate={{
          scale: [1, 1.15, 1],
          y: [0, -5, 0]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Additional love3 at top center-right */}
      <motion.img
        src="/love3.webp"
        alt=""
        className="fixed top-28 right-1/4 w-6 md:w-8 z-30 pointer-events-none select-none opacity-50"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
    </>
  );
};

export default FloatingDecorations;
