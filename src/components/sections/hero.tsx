'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Play, Phone, MapPin, Activity, BellRing, ShieldAlert } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { useLanguage } from '@/hooks/use-language'
import { STATS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default function Hero() {
  const { language, t } = useLanguage()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [activeStat, setActiveStat] = useState<number | null>(null)
  const [user, setUser] = useState<{ name: string; email: string; phone: string; role: string } | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user')
      if (stored) {
        setUser(JSON.parse(stored))
      }
    }
  }, [])

  // 3D Road Perspective & Ambulance Path simulation on Canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let offset = 0

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800
      canvas.height = canvas.parentElement?.clientHeight || 500
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Drawing loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const w = canvas.width
      const h = canvas.height
      const horizon = h * 0.45
      
      // Draw Grid / Map lines in perspective
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.15)'
      ctx.lineWidth = 1.5

      // Perspective longitudinal lines
      const lineCount = 12
      for (let i = 0; i <= lineCount; i++) {
        const xPercent = i / lineCount
        const xStart = w * xPercent
        const xEnd = w * 0.5 + (xPercent - 0.5) * (w * 0.15)
        
        ctx.beginPath()
        ctx.moveTo(xStart, h)
        ctx.lineTo(xEnd, horizon)
        ctx.stroke()
      }

      // Transverse road lines (moving animation)
      offset = (offset + 1.8) % 40
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)'
      for (let y = h; y > horizon; y -= 35) {
        const perspectiveY = y - offset
        if (perspectiveY < horizon) continue
        
        ctx.beginPath()
        ctx.moveTo(0, perspectiveY)
        ctx.lineTo(w, perspectiveY)
        ctx.stroke()
      }

      // Draw Main Road in the center
      ctx.fillStyle = 'rgba(15, 23, 42, 0.04)'
      ctx.beginPath()
      ctx.moveTo(w * 0.2, h)
      ctx.lineTo(w * 0.44, horizon)
      ctx.lineTo(w * 0.56, horizon)
      ctx.lineTo(w * 0.8, h)
      ctx.closePath()
      ctx.fill()

      // Central yellow dashed line
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)'
      ctx.lineWidth = 3
      ctx.setLineDash([15, 20])
      ctx.beginPath()
      ctx.moveTo(w * 0.5, h - offset * 1.5)
      ctx.lineTo(w * 0.5, horizon)
      ctx.stroke()
      ctx.setLineDash([])

      // Draw active GPS connection dots (network hubs)
      const time = Date.now() * 0.003
      const dotCount = 8
      for (let i = 0; i < dotCount; i++) {
        const angle = (i * Math.PI * 2) / dotCount + time * 0.2
        const rx = w * 0.5 + Math.cos(angle) * (w * 0.3)
        const ry = horizon + h * 0.35 + Math.sin(angle) * (h * 0.15)
        
        // Pulse radius
        const rPulse = 4 + Math.abs(Math.sin(time + i)) * 6
        ctx.fillStyle = 'rgba(6, 182, 212, 0.6)'
        ctx.beginPath()
        ctx.arc(rx, ry, rPulse, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw flowing ambulance line path
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(w * 0.5, h)
      ctx.bezierCurveTo(w * 0.45, h * 0.8, w * 0.55, h * 0.6, w * 0.5, horizon)
      ctx.stroke()

      // Pulsing Ambulance Dot
      const ambY = horizon + (h - horizon) * (0.5 + Math.sin(time) * 0.4)
      const ambX = w * 0.5 + Math.sin(time * 2) * (w * 0.03)
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.arc(ambX, ambY, 9, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)'
      ctx.lineWidth = 6
      ctx.stroke()
      
      animationFrameId = requestAnimationFrame(draw)
    }
    
    draw()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  } as any

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  } as any

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-slate-100 dark:bg-slate-950">
      
      {/* Decoupled Background Image with customized opacity */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.14] dark:opacity-[0.06] pointer-events-none z-0 mix-blend-overlay"
        style={{ backgroundImage: "url('/expressway.png')" }}
      />

      {/* Adaptive Theme Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-slate-100/90 to-slate-50 dark:from-slate-950/90 dark:via-slate-950/95 dark:to-slate-950 z-0 pointer-events-none" />

      {/* Decorative Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Column Text */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 text-left space-y-6"
          >
            {/* National Initiative Flag */}
            <motion.div variants={itemVariants} className="inline-flex flex-col sm:flex-row sm:items-center gap-2.5 px-4.5 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-md">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-slate-800 dark:text-slate-100 tracking-wide uppercase">
                  {t('govtInitiative')}
                </span>
              </div>
              <span className="hidden sm:inline text-slate-355 dark:text-slate-700">|</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none">
                {t('ministryLabel')}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-950 dark:text-white"
            >
              {language === 'hi' ? (
                <>
                  हर सेकंड <br />
                  <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 dark:from-blue-400 dark:via-cyan-400 dark:to-emerald-400 bg-clip-text text-transparent">
                    एक जीवन बचाता है।
                  </span>
                </>
              ) : (
                <>
                  Every Second <br />
                  <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 dark:from-blue-400 dark:via-cyan-400 dark:to-emerald-400 bg-clip-text text-transparent">
                    Saves a Life.
                  </span>
                </>
              )}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl"
            >
              {t('heroSubtitle')}
            </motion.p>

            {/* Emergency Indicators */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-lg border border-green-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                {language === 'hi' ? 'लाइव जीपीएस सक्रिय' : 'Live GPS Sync Active'}
              </div>
              <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg border border-blue-500/20">
                <BellRing className="w-3.5 h-3.5" />
                {language === 'hi' ? '18K+ ट्रामा केंद्र जुड़े हैं' : '18K+ Trauma Centers Connected'}
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 pt-4"
            >
              <a 
                href="/live-map" 
                className={cn(buttonVariants({ variant: 'default', size: 'lg' }), "flex items-center gap-2 group")}
              >
                {language === 'hi' ? 'लाइव मानचित्र देखें' : 'View Live Map'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a 
                href="/live-map" 
                className={cn(buttonVariants({ variant: 'sos', size: 'lg' }), "flex items-center gap-2")}
              >
                <Phone className="w-5 h-5 text-white" />
                {t('sosButton')}
              </a>
              
              <Button variant="outline" size="lg" className="flex items-center gap-2 border-slate-300 dark:border-slate-700">
                <Play className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                {t('watchDemo')}
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Right Column Visual (3D Road Simulator Canvas card) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-5 relative w-full h-[380px] lg:h-[480px] rounded-3xl overflow-hidden glass-panel shadow-2xl border border-slate-200 dark:border-slate-800"
          >
            {/* Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0" />
            
            {user ? (
              /* Citizen Control Panel HUD (Visible ONLY when logged in!) */
              <div className="absolute inset-0 p-6 flex flex-col justify-between z-20 bg-slate-950/90 text-white rounded-3xl border border-blue-500/30 backdrop-blur-md pointer-events-auto">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
                      <span className="text-xs font-black text-slate-100 uppercase tracking-widest font-mono">
                        {language === 'hi' ? 'नागरिक सुरक्षा HUD' : 'Citizen Security HUD'}
                      </span>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-extrabold rounded-md border border-emerald-500/30 uppercase tracking-wider">
                      {language === 'hi' ? 'सत्यापित नागरिक' : 'Verified'}
                    </span>
                  </div>
                  
                  <div className="space-y-2.5 pt-2 text-xs">
                    <div className="flex justify-between bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-slate-400">{language === 'hi' ? 'नाम' : 'Citizen Name'}:</span>
                      <span className="font-bold text-slate-100">{user.name}</span>
                    </div>
                    <div className="flex justify-between bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-slate-400">{language === 'hi' ? 'फ़ोन नंबर' : 'Phone'}:</span>
                      <span className="font-bold text-slate-100">{user.phone}</span>
                    </div>
                    <div className="flex justify-between bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-slate-400">{language === 'hi' ? 'भूमिका' : 'Role'}:</span>
                      <span className="font-bold text-cyan-400 font-mono uppercase tracking-wider">{user.role}</span>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-left space-y-2.5 mt-4">
                    <h4 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-blue-400" />
                      {language === 'hi' ? 'त्वरित नियंत्रण' : 'Quick Controls'}
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      {language === 'hi' ? 'आपकी लाइव संपर्क सूची और स्वास्थ्य प्रोफ़ाइल राष्ट्रीय राजमार्ग बचाव डेस्क से जुड़ी है।' : 'Your live emergency contacts and health profile are synchronized directly with national rescue desks.'}
                    </p>
                    <div className="flex gap-2 pt-1">
                      <a href="/dashboard" className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-[10px] font-bold rounded-lg transition-colors text-white uppercase tracking-wider">
                        {t('dashboard')}
                      </a>
                      <a href="/live-map" className="px-3 py-2 bg-red-600 hover:bg-red-500 text-[10px] font-bold rounded-lg transition-colors text-white uppercase tracking-wider">
                        {language === 'hi' ? 'नक्शा देखें' : 'View Live Map'}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-900 rounded-xl p-3 flex justify-between items-center text-[10px] text-slate-400">
                  <span>{language === 'hi' ? 'सुरक्षित नागरिक सत्र सक्रिय' : 'Secure Citizen Session Active'}</span>
                  <span className="font-mono text-emerald-500 text-xs font-extrabold">● ONLINE</span>
                </div>
              </div>
            ) : (
              /* Interface Overlay Info (Tesla Digital Dashboard HUD style - standard view when logged out) */
              <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-10">
                
                {/* HUD top indicators */}
                <div className="flex justify-between items-start">
                  <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-red-500 animate-pulse" />
                    <div className="text-[10px] text-slate-400">
                      <span className="text-white font-bold font-mono">DISPATCH RADAR</span>
                    </div>
                  </div>
                  <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] text-right font-mono text-cyan-400">
                    GPS: CALIBRATING...
                  </div>
                </div>

                {/* HUD central overlay floating card */}
                <div className="self-center w-full max-w-xs bg-slate-950/85 backdrop-blur-md border border-slate-800/80 p-4 rounded-2xl shadow-xl space-y-3 pointer-events-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-white">Active Golden Hour Track</h4>
                      <p className="text-[10px] text-slate-400">Response unit: AMB-0462</p>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: '0%' }}
                      animate={{ width: '78%' }}
                      transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                    <span>ETA: 4 MINS</span>
                    <span>DIST: 1.8 KM</span>
                  </div>
                </div>

                {/* HUD bottom status */}
                <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                    <span className="text-slate-400 font-medium">Gateway Node Active</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 font-mono">V.2.06</span>
                </div>
              </div>
            )}
          </motion.div>

        </div>

        {/* Stats Grid Footer Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mt-16 pt-8 border-t border-slate-200/50 dark:border-slate-800/50"
        >
          {STATS.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -4 }}
              onHoverStart={() => setActiveStat(idx)}
              onHoverEnd={() => setActiveStat(null)}
              className={`p-5 rounded-2xl border transition-all duration-300 ${
                activeStat === idx
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/10'
                  : 'bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-slate-200/40 dark:border-slate-800/50 shadow-md'
              }`}
            >
              <div className={`text-2xl md:text-3xl font-extrabold mb-1.5 ${
                activeStat === idx ? 'text-white' : 'bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent'
              }`}>
                {stat.value}
              </div>
              <div className={`text-xs font-semibold ${
                activeStat === idx ? 'text-blue-100' : 'text-slate-600 dark:text-slate-400'
              }`}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
