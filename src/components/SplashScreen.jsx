import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish()
    }, 2500)
    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <motion.div 
      className="splash-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="splash-content">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 1 
          }}
          className="splash-logo"
        >
          <Heart size={80} fill="#fff" strokeWidth={0} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="splash-title"
        >
          Therapick
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="splash-tagline"
        >
          Finding Therapists The Easy Way
        </motion.p>
      </div>
    </motion.div>
  )
}

export default SplashScreen
