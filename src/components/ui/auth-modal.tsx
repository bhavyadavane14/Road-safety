'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock, Mail, User, Phone, ShieldCheck, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useAccessibility } from '@/hooks/use-accessibility'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (user: { name: string; email: string; phone: string; role: string }) => void
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const { speak } = useAccessibility()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    const endpoint = isLogin ? `${API_URL}/api/auth/login` : `${API_URL}/api/auth/signup`
    const payload = isLogin ? { email, password } : { name, email, password, phone }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please verify inputs.')
      }

      // Success
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      speak(`Welcome back, ${data.user.name}. Access unlocked.`)
      onSuccess(data.user)
      onClose()
    } catch (err: any) {
      setErrorMsg(err.message)
      speak(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
        >
          {/* Modal Card wrapper */}
          <motion.div
            initial={{ scale: 0.95, y: 25 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 25 }}
            className="w-full max-w-md relative z-10"
          >
            <Card className="border border-slate-200/50 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden text-slate-800 dark:text-white">
              
              {/* Top national ribbon colors decor */}
              <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-green-500" />

              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600 dark:text-cyan-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">RoadSOS Portal</CardTitle>
                    <span className="text-[10px] text-slate-400 font-bold block leading-none">GOVERNMENT ACCREDITED</span>
                  </div>
                </div>

                <button 
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </CardHeader>

              <CardContent className="space-y-6 pt-2">
                
                {/* Form type toggler */}
                <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
                  <button
                    onClick={() => { setIsLogin(true); setErrorMsg('') }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isLogin 
                        ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-white' 
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    User Login
                  </button>
                  <button
                    onClick={() => { setIsLogin(false); setErrorMsg('') }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      !isLogin 
                        ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-white' 
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Register Citizen
                  </button>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-500 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Forms fields */}
                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
                  
                  {!isLogin && (
                    <div className="space-y-1.5">
                      <label className="text-slate-500 block">Full Name</label>
                      <div className="relative">
                        <User className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Rahul Sharma"
                          className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-700 pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-slate-500 block">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="rahul@nic.in"
                        className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-700 pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                      />
                    </div>
                  </div>

                  {!isLogin && (
                    <div className="space-y-1.5">
                      <label className="text-slate-500 block">Phone Number</label>
                      <div className="relative">
                        <Phone className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 99999 88888"
                          className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-700 pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-slate-500 block">Security Password</label>
                    <div className="relative">
                      <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-700 pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full font-bold py-3 mt-4 text-xs bg-gradient-to-r from-blue-600 to-cyan-500 shadow-md flex items-center justify-center gap-1.5"
                  >
                    {loading ? 'Authenticating Gateway...' : isLogin ? 'Authenticate Access' : 'Register Citizen Account'}
                  </Button>
                </form>

                <p className="text-[10px] text-slate-500 leading-relaxed text-center">
                  Protected under Digital India security frameworks. Unauthorized attempts will be logged by government audits.
                </p>
              </CardContent>

            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
