'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Moon, Sun, Globe, Phone, AlertTriangle, Eye, ShieldAlert, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage, LanguageCode, LANGUAGES } from '@/hooks/use-language'
import { useAccessibility, ColorBlindMode } from '@/hooks/use-accessibility'
import { cn } from '@/lib/utils'
import AuthModal from '@/components/ui/auth-modal'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false)
  const [isAccDropdownOpen, setIsAccDropdownOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string; phone: string; role: string } | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user')
      if (stored) {
        try {
          setUser(JSON.parse(stored))
        } catch (e) {
          console.error(e)
        }
      }
    }
  }, [])
  
  // SOS Emergency Drawer State
  const [isSosOpen, setIsSosOpen] = useState(false)
  const [sosCountdown, setSosCountdown] = useState(5)
  const [isSosTriggered, setIsSosTriggered] = useState(false)
  const countdownTimer = useRef<NodeJS.Timeout | null>(null)

  const { language, setLanguage, t } = useLanguage()
  const { 
    highContrast, setHighContrast, 
    largeText, setLargeText, 
    colorBlindMode, setColorBlindMode, 
    screenReaderActive, setScreenReaderActive,
    speak, stopSpeaking
  } = useAccessibility()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Dark mode trigger
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setIsDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDarkMode(false)
      speak('Light mode activated')
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDarkMode(true)
      speak('Dark mode activated')
    }
  }

  // SOS Countdown logic
  useEffect(() => {
    if (isSosOpen && !isSosTriggered && sosCountdown > 0) {
      countdownTimer.current = setTimeout(() => {
        setSosCountdown(prev => prev - 1)
        speak(String(sosCountdown - 1))
      }, 1000)
    } else if (sosCountdown === 0 && !isSosTriggered) {
      setIsSosTriggered(true)
      speak('SOS Alert triggered. Sending GPS coordinate and alerting nearest hospitals and ambulances.')
      // Simulate API call to report emergency
      fetch('/api/incidents/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: 12.9716,
          longitude: 77.5946,
          description: 'Emergency SOS button triggered from web dashboard',
          severity: 'critical'
        })
      }).catch(err => console.log('Mock server request', err))
    }
    return () => {
      if (countdownTimer.current) clearTimeout(countdownTimer.current)
    }
  }, [isSosOpen, sosCountdown, isSosTriggered])

  const startSos = () => {
    setIsSosOpen(true)
    setSosCountdown(5)
    setIsSosTriggered(false)
    speak('Emergency SOS activation started. Alert triggers in 5 seconds. Press Cancel to abort.')
  }

  const cancelSos = () => {
    setIsSosOpen(false)
    if (countdownTimer.current) clearTimeout(countdownTimer.current)
    setIsSosTriggered(false)
    speak('SOS cancelled successfully.')
  }

  const navItems = [
    { name: t('home'), href: '/' },
    { name: t('mapTitle'), href: '/live-map' },
    { name: t('firstAidTitle'), href: '/first-aid' },
    { name: t('dashboard'), href: '/dashboard' },
    { name: t('about'), href: '/about' },
    { name: t('contact'), href: '/contact' },
  ]

  const colorBlindOptions: { label: string; value: ColorBlindMode }[] = [
    { label: 'Normal Vision', value: 'normal' },
    { label: 'Protanopia (Red Weak)', value: 'protanopia' },
    { label: 'Deuteranopia (Green Weak)', value: 'deuteranopia' },
    { label: 'Tritanopia (Blue Weak)', value: 'tritanopia' },
    { label: 'Monochrome (Grayscale)', value: 'monochrome' }
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-500',
          isScrolled
            ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-lg border-b border-slate-200/50 dark:border-slate-800/50'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.a
              href="/"
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-12 h-12 flex items-center justify-center relative bg-white dark:bg-slate-900 rounded-full shadow-md border border-slate-200 dark:border-slate-800 p-0.5">
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800 dark:text-white" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="50" cy="50" r="46" stroke="orange" strokeWidth="1.5" />
                  <circle cx="50" cy="50" r="41" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2,2" />
                  <circle cx="50" cy="50" r="32" stroke="emerald" strokeWidth="1.5" />
                  {/* Ashoka Chakra in center */}
                  <circle cx="50" cy="50" r="10" stroke="blue" strokeWidth="1" />
                  {Array.from({ length: 24 }).map((_, idx) => {
                    const ang = (idx * Math.PI * 2) / 24;
                    return (
                      <line key={idx} x1="50" y1="50" x2={50 + Math.cos(ang) * 10} y2={50 + Math.sin(ang) * 10} stroke="blue" strokeWidth="0.3" />
                    )
                  })}
                  <circle cx="50" cy="50" r="2.5" fill="orange" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">
                  सड़क सुरक्षा • ROAD SAFETY
                </span>
                <span className="text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none mt-1">
                  भारत सरकार • GOVT OF INDIA
                </span>
              </div>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center gap-6">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  whileHover={{ y: -2 }}
                  className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 font-medium text-sm transition-colors"
                  onClick={() => speak(`Navigate to ${item.name}`)}
                >
                  {item.name}
                </motion.a>
              ))}
            </div>

            {/* Action Bar */}
            <div className="hidden lg:flex items-center gap-3">
              
              {/* Language Switcher */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsLangDropdownOpen(!isLangDropdownOpen)
                    speak('Language switcher')
                  }}
                  className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-2 font-semibold text-sm transition-colors"
                >
                  <Globe className="w-5 h-5" />
                  <span className="uppercase">{language}</span>
                </motion.button>

                <AnimatePresence>
                  {isLangDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="absolute right-0 mt-3 w-48 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50"
                    >
                      <div className="max-h-60 overflow-y-auto py-2">
                        {LANGUAGES.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setLanguage(lang.code as LanguageCode)
                              setIsLangDropdownOpen(false)
                              speak(`Language changed to ${lang.name}`)
                            }}
                            className={cn(
                              'w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between',
                              language === lang.code
                                ? 'bg-blue-600 text-white font-bold'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            )}
                          >
                            {lang.name}
                            {language === lang.code && <Check className="w-4 h-4" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dark Mode */}
              <motion.button
                whileHover={{ scale: 1.05, rotate: 15 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>

              {/* Login / Auth */}
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Namaste, {user.name.split(' ')[0]}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      localStorage.removeItem('token')
                      localStorage.removeItem('user')
                      setUser(null)
                      speak('Logged out successfully.')
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setIsAuthModalOpen(true)
                      speak('Login portal active.')
                    }}
                  >
                    {t('login')}
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => {
                      setIsAuthModalOpen(true)
                      speak('Citizen registration active.')
                    }}
                  >
                    {t('signUp')}
                  </Button>
                </>
              )}

              {/* SOS Emergency button */}
              <Button 
                variant="sos" 
                size="icon" 
                className="!rounded-full !w-14 !h-14 animate-sos-pulse relative"
                onClick={startSos}
              >
                <Phone className="w-6 h-6 text-white" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="container mx-auto px-6 py-6 space-y-4">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block py-3 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 font-medium text-base border-b border-slate-100 dark:border-slate-900"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      speak(item.name)
                    }}
                  >
                    {item.name}
                  </a>
                ))}
                
                {/* Mobile Accessibility toggler */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={cn(highContrast && "bg-slate-200 dark:bg-slate-700")}
                    onClick={() => {
                      setHighContrast(!highContrast)
                      speak('High contrast mode toggled')
                    }}
                  >
                    High Contrast
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={cn(largeText && "bg-slate-200 dark:bg-slate-700")}
                    onClick={() => {
                      setLargeText(!largeText)
                      speak('Accessible text size toggled')
                    }}
                  >
                    Large Text
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={cn(screenReaderActive && "bg-slate-200 dark:bg-slate-700")}
                    onClick={() => {
                      setScreenReaderActive(!screenReaderActive)
                      if (!screenReaderActive) {
                        setTimeout(() => speak('Voice assistant active'), 100)
                      }
                    }}
                  >
                    Voice Guide
                  </Button>
                </div>

                {user ? (
                  <div className="flex flex-col gap-2 pt-2">
                    <span className="text-sm font-semibold text-slate-850 dark:text-slate-200 text-center">
                      Namaste, {user.name}
                    </span>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        localStorage.removeItem('token')
                        localStorage.removeItem('user')
                        setUser(null)
                        speak('Logged out successfully.')
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-3 pt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1" 
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        setIsAuthModalOpen(true)
                        speak('Login portal')
                      }}
                    >
                      {t('login')}
                    </Button>
                    <Button 
                      variant="default" 
                      className="flex-1" 
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        setIsAuthModalOpen(true)
                        speak('Citizen registration portal')
                      }}
                    >
                      {t('signUp')}
                    </Button>
                  </div>
                )}
                <Button variant="sos" className="w-full flex items-center justify-center gap-2" onClick={startSos}>
                  <Phone className="w-5 h-5 text-white" />
                  {t('sosButton')}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* SOS Countdown Overlay Drawer */}
      <AnimatePresence>
        {isSosOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-slate-900 border-2 border-red-500/30 rounded-3xl p-8 max-w-xl w-full text-center relative overflow-hidden shadow-[0_0_80px_rgba(239,68,68,0.25)]"
            >
              {/* Background emergency light pulse effect */}
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-red-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
              
              <AlertTriangle className="w-20 h-20 text-red-500 mx-auto mb-6 animate-bounce" />
              
              {!isSosTriggered ? (
                <>
                  <h2 className="text-4xl font-extrabold text-white mb-2">TRIGGERING EMERGENCY SOS</h2>
                  <p className="text-slate-400 text-lg mb-8">
                    Contacting nearest hospitals, police stations, and dispatching ambulance in:
                  </p>
                  
                  {/* Big countdown timer circle */}
                  <div className="w-40 h-40 rounded-full border-4 border-red-500/20 flex items-center justify-center mx-auto mb-10 relative">
                    <span className="text-7xl font-extrabold text-red-500 animate-ping absolute">{sosCountdown}</span>
                    <span className="text-7xl font-extrabold text-white relative z-10">{sosCountdown}</span>
                    <div className="absolute inset-0 rounded-full border-4 border-t-red-500 animate-spin" style={{ animationDuration: '1s' }} />
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button variant="destructive" size="lg" className="w-full text-lg py-4 font-bold" onClick={cancelSos}>
                      CANCEL SOS ALERT
                    </Button>
                    <p className="text-xs text-slate-500">
                      If you do not press Cancel, alerts will be broadcasted to government road safety units automatically.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-extrabold text-green-400 mb-2">SOS ALERT BROADCASTED</h2>
                  <p className="text-slate-300 text-lg mb-8">
                    GPS coordinates captured successfully. Emergency units are responding.
                  </p>
                  
                  <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6 text-left space-y-3 mb-8">
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>Coordinates:</span>
                      <span className="font-mono text-white font-bold">12.9716° N, 77.5946° E</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>Nearest Trauma Care:</span>
                      <span className="text-white font-bold">Apollo Hospital (1.4 km)</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>Ambulance Status:</span>
                      <span className="text-cyan-400 font-bold animate-pulse">Dispatched (ETA 5m)</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>SMS Broadcasts:</span>
                      <span className="text-green-400 font-bold">Sent to 3 Emergency Contacts</span>
                    </div>
                  </div>

                  <Button variant="outline" size="lg" className="w-full text-lg py-4 font-bold text-slate-300 hover:text-white" onClick={() => setIsSosOpen(false)}>
                    CLOSE EMERGENCY VIEW
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={(userData) => setUser(userData)} 
      />
    </>
  )
}
