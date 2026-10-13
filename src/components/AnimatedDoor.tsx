import { motion } from 'framer-motion';

interface AnimatedDoorProps {
  isOpen: boolean;
  mode: 'signin' | 'signup';
}

/**
 * A 2.5D illustrated gateway/door with creeping ivy and soft lighting.
 * When isOpen, the door panels swing open and a silhouette walks through.
 */
export function AnimatedDoor({ isOpen, mode }: AnimatedDoorProps) {
  const swingAngle = isOpen ? (mode === 'signin' ? -78 : 78) : 0;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: isOpen
            ? 'radial-gradient(circle at 50% 50%, rgba(62,123,74,0.35) 0%, rgba(15,56,35,0.05) 50%, transparent 80%)'
            : 'radial-gradient(circle at 50% 50%, rgba(217,119,6,0.12) 0%, rgba(15,56,35,0.03) 50%, transparent 80%)',
        }}
        transition={{ duration: 1.2 }}
      />

      {/* Stone arch frame */}
      <div className="relative" style={{ width: 280, height: 380 }}>
        {/* Arch backdrop (warm light through the door) */}
        <div
          className="absolute inset-0 rounded-t-[140px] overflow-hidden"
          style={{
            background: isOpen
              ? 'linear-gradient(180deg, #C9E0CD 0%, #E8F0EA 40%, #FBFBFA 100%)'
              : 'linear-gradient(180deg, #174B2E 0%, #0F3823 60%, #0A2A18 100%)',
            boxShadow: isOpen ? '0 0 80px rgba(62,123,74,0.5)' : 'none',
          }}
        >
          {/* Walking silhouette when open */}
          {isOpen && (
            <motion.div
              className="absolute bottom-0 left-1/2"
              initial={{ x: '-50%', y: 60, opacity: 0 }}
              animate={{
                x: mode === 'signin' ? ['-50%', '-50%', '-50%'] : ['-50%', '-180%', '-260%'],
                y: [60, 0, -20],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 2.5, times: [0, 0.3, 1], ease: 'easeInOut' }}
            >
              <svg width="36" height="72" viewBox="0 0 36 72" fill="none">
                <ellipse cx="18" cy="10" rx="7" ry="8" fill="#0F3823" />
                <path d="M11 18 Q18 14 25 18 L24 44 Q22 55 20 60 L16 60 Q14 55 12 44 Z" fill="#0F3823" />
                <motion.g
                  animate={{ rotate: [0, 25, -25, 0] }}
                  transition={{ duration: 1, repeat: 1 }}
                  style={{ transformOrigin: '12px 22px' }}
                >
                  <rect x="9" y="22" width="5" height="20" rx="2.5" fill="#0F3823" />
                </motion.g>
                <motion.g
                  animate={{ rotate: [0, -25, 25, 0] }}
                  transition={{ duration: 1, repeat: 1 }}
                  style={{ transformOrigin: '27px 22px' }}
                >
                  <rect x="25" y="22" width="5" height="20" rx="2.5" fill="#0F3823" />
                </motion.g>
                <motion.g
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 1, repeat: 1 }}
                >
                  <rect x="13" y="58" width="5" height="14" rx="2" fill="#0F3823" />
                </motion.g>
                <motion.g
                  animate={{ y: [0, 0, -12] }}
                  transition={{ duration: 1, repeat: 1 }}
                >
                  <rect x="20" y="58" width="5" height="14" rx="2" fill="#0F3823" />
                </motion.g>
              </svg>
            </motion.div>
          )}

          {/* Light rays when open */}
          {isOpen && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-full bg-gradient-to-b from-white/40 to-transparent" style={{ transform: 'translateX(-30px) rotate(15deg)' }} />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-full bg-gradient-to-b from-white/30 to-transparent" style={{ transform: 'translateX(20px) rotate(-12deg)' }} />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-full bg-gradient-to-b from-white/20 to-transparent" style={{ transform: 'translateX(0px)' }} />
            </motion.div>
          )}
        </div>

        {/* Ivy on the arch */}
        <svg className="absolute -top-2 -left-4 pointer-events-none" width="120" height="180" viewBox="0 0 120 180" fill="none">
          <motion.path
            d="M60 170 Q40 120 55 80 Q70 50 50 20 Q45 10 55 5"
            stroke="#3E7B4A"
            strokeWidth="2"
            fill="none"
            animate={{ pathLength: [0, 1] }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
          />
          {[
            { cx: 48, cy: 90, r: 8 },
            { cx: 62, cy: 65, r: 7 },
            { cx: 50, cy: 35, r: 9 },
            { cx: 55, cy: 12, r: 6 },
          ].map((leaf, i) => (
            <motion.ellipse
              key={i}
              cx={leaf.cx}
              cy={leaf.cy}
              rx={leaf.r}
              ry={leaf.r * 0.7}
              fill={i % 2 === 0 ? '#3E7B4A' : '#6FA079'}
              animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.3 }}
              style={{ transformOrigin: `${leaf.cx}px ${leaf.cy}px` }}
            />
          ))}
        </svg>

        <svg className="absolute -top-2 -right-4 pointer-events-none" width="120" height="180" viewBox="0 0 120 180" fill="none" style={{ transform: 'scaleX(-1)' }}>
          <motion.path
            d="M60 170 Q40 120 55 80 Q70 50 50 20 Q45 10 55 5"
            stroke="#3E7B4A"
            strokeWidth="2"
            fill="none"
            animate={{ pathLength: [0, 1] }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', delay: 1 }}
          />
          {[
            { cx: 48, cy: 100, r: 7 },
            { cx: 62, cy: 70, r: 8 },
            { cx: 50, cy: 40, r: 6 },
          ].map((leaf, i) => (
            <motion.ellipse
              key={i}
              cx={leaf.cx}
              cy={leaf.cy}
              rx={leaf.r}
              ry={leaf.r * 0.7}
              fill={i % 2 === 0 ? '#6FA079' : '#3E7B4A'}
              animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.4 }}
              style={{ transformOrigin: `${leaf.cx}px ${leaf.cy}px` }}
            />
          ))}
        </svg>

        {/* Left door panel */}
        <motion.div
          className="absolute top-0 bottom-0 rounded-tl-[140px]"
          style={{
            left: 0,
            width: 140,
            height: '100%',
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center',
            zIndex: 10,
          }}
          animate={{ rotateY: swingAngle }}
          transition={{ type: 'spring', stiffness: 40, damping: 12, mass: 1.5 }}
        >
          <div
            className="w-full h-full rounded-t-[140px] rounded-tr-none border-2 border-forest-800/30"
            style={{
              background: 'linear-gradient(135deg, #1E5E3A 0%, #174B2E 50%, #0F3823 100%)',
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3)',
            }}
          >
            {/* Door panel detail */}
            <div className="absolute top-12 left-4 right-1 bottom-20 border-2 border-gold-500/20 rounded-lg flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-full border-2 border-gold-500/30 flex items-center justify-center">
                <motion.div
                  className="w-3 h-3 rounded-full bg-gold-400"
                  animate={{ opacity: isOpen ? [0.4, 1, 0.4] : 0.3 }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="w-16 h-1 bg-gold-500/20 rounded-full" />
              <div className="w-12 h-1 bg-gold-500/15 rounded-full" />
            </div>

            {/* Door handle */}
            <motion.div
              className="absolute top-1/2 right-3 w-3 h-10 rounded-full bg-gradient-to-b from-gold-400 to-gold-600 shadow-lg"
              animate={{ scale: isOpen ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </motion.div>

        {/* Right door panel */}
        <motion.div
          className="absolute top-0 bottom-0 rounded-tr-[140px]"
          style={{
            right: 0,
            width: 140,
            height: '100%',
            transformStyle: 'preserve-3d',
            transformOrigin: 'right center',
            zIndex: 10,
          }}
          animate={{ rotateY: -swingAngle }}
          transition={{ type: 'spring', stiffness: 40, damping: 12, mass: 1.5 }}
        >
          <div
            className="w-full h-full rounded-t-[140px] rounded-tl-none border-2 border-forest-800/30"
            style={{
              background: 'linear-gradient(225deg, #1E5E3A 0%, #174B2E 50%, #0F3823 100%)',
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3)',
            }}
          >
            <div className="absolute top-12 right-4 left-1 bottom-20 border-2 border-gold-500/20 rounded-lg flex flex-col items-center justify-center gap-2">
              <div className="w-16 h-1 bg-gold-500/20 rounded-full" />
              <div className="w-12 h-1 bg-gold-500/15 rounded-full" />
              <div className="w-10 h-10 rounded-full border-2 border-gold-500/30" />
            </div>

            <motion.div
              className="absolute top-1/2 left-3 w-3 h-10 rounded-full bg-gradient-to-b from-gold-400 to-gold-600 shadow-lg"
              animate={{ scale: isOpen ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </motion.div>

        {/* Keystone at top of arch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-8 bg-gradient-to-b from-cream-300 to-cream-400 rounded-t-lg shadow-md z-20" />

        {/* Ground shadow */}
        <motion.div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-forest-900/20 blur-md"
          animate={{ width: isOpen ? 300 : 200, opacity: isOpen ? 0.3 : 0.15 }}
          transition={{ duration: 1 }}
          style={{ height: 20 }}
        />
      </div>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-sage-300/40"
          initial={{
            x: (i - 4) * 50 + 140,
            y: 300 + (i % 3) * 50,
            opacity: 0,
          }}
          animate={{
            y: [300 + (i % 3) * 50, 100],
            opacity: [0, 0.8, 0],
            x: (i - 4) * 50 + 140 + (i % 2 === 0 ? 20 : -20),
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
