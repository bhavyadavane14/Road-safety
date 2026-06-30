'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, Image as ImageIcon, Sparkles, User, Bot, Volume2, VolumeX, ShieldAlert, Cpu, X, MessageSquare, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useLanguage } from '@/hooks/use-language'
import { useAccessibility } from '@/hooks/use-accessibility'

interface Message {
  role: 'user' | 'assistant'
  content: string
  audioData?: boolean
  imagePreview?: string
  visionResult?: {
    damage: string
    hazards: string[]
    severityScore: number
    summary: string
  }
}

export default function AIAssistant() {
  const { language, t } = useLanguage()
  const { speak, stopSpeaking } = useAccessibility()
  
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(true)
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  // Populate first welcome message on mount
  useEffect(() => {
    setMessages([
      { 
        role: 'assistant', 
        content: t('chatbotWelcome') 
      }
    ])
  }, [language])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const examples = [
    language === 'hi' ? 'मेरा एक्सीडेंट हो गया है' : 'I met with an accident',
    language === 'hi' ? 'सीपीआर (CPR) कैसे करें' : 'How to do CPR',
    language === 'hi' ? 'नजदीकी अस्पताल' : 'Nearest hospital'
  ]

  // Custom response mapper based on emergency text triggers (Bilingual support)
  const getAIResponse = (text: string): Message => {
    const clean = text.toLowerCase()
    
    if (clean.includes('accident') || clean.includes('crash') || clean.includes('दुर्घटना') || clean.includes('एक्सीडेंट')) {
      return {
        role: 'assistant',
        content: language === 'hi' 
          ? "🚨 आपातकालीन प्रोटोकॉल सक्रिय। 1. वाहन की हैजार्ड लाइट्स चालू करें। 2. जांचें: क्या रक्तस्राव हो रहा है? यदि हाँ, तो साफ कपड़े से घाव दबाएं। 3. निकटतम अपोलो अस्पताल (1.4 किमी) सूचित हो गया है। घायलों को तब तक न हिलाएं जब तक आग का खतरा न हो।"
          : "🚨 Critical Incident Protocol Activated. 1. Turn on hazard warning lights. 2. Safe check: Are you or others bleeding? If there is bleeding, apply firm pressure with a clean cloth. 3. Nearest responders (Apollo Hospital, 1.4 km) are notified. Do not move injured victims unless there is threat of fire."
      }
    }
    if (clean.includes('cpr') || clean.includes('unconscious') || clean.includes('बेहोश') || clean.includes('सांस')) {
      return {
        role: 'assistant',
        content: language === 'hi'
          ? "🩹 बेहोशी/सीपीआर निर्देश। 1. प्रतिक्रिया जांचें: कंधे हिलाएं और पुकारें। 2. सिर पीछे झुकाएं, सांस मार्ग खोलने के लिए ठुड्डी उठाएं। 3. यदि व्यक्ति सांस नहीं ले रहा है, तो सीपीआर (CPR) शुरू करें: छाती के बीच में प्रति मिनट 100-120 कंप्रेस की दर से तेजी से दबाएं। तुरंत 102 पर कॉल करें।"
          : "🩹 Unconscious Casualty Protocol. 1. Check response: shake shoulders and shout. 2. Tilt head back, lift chin to open airway. 3. Check breathing. If not breathing, start CPR: push hard and fast in the center of the chest (100-120 compressions per minute). Call 102 immediately."
      }
    }
    if (clean.includes('trauma') || clean.includes('hospital') || clean.includes('अस्पताल') || clean.includes('नजदीक')) {
      return {
        role: 'assistant',
        content: language === 'hi'
          ? "🏥 आपका नजदीकी ट्रामा सेंटर अपोलो अस्पताल है (1.4 किमी दूर, ईटीए 5 मिनट)। आईसीयू बेड उपलब्ध हैं: 12. मार्ग समन्वित हो गया है। हमने आपके जीपीएस निर्देशांक (12.9716 N, 77.5946 E) आपातकालीन टीम को भेज दिए हैं।"
          : "🏥 Nearest trauma center is Apollo Hospital (1.4 km away, ETA 5 minutes). ICU beds available: 12. Path route synchronized. I have shared your GPS coordinates (12.9716 N, 77.5946 E) with their triage desk."
      }
    }

    return {
      role: 'assistant',
      content: language === 'hi'
        ? "मैंने आपकी जानकारी दर्ज कर ली है। यदि आपको तत्काल आपातकालीन दिशा-निर्देश, गश्ती दल की सहायता, या चिकित्सा निर्देश चाहिए तो मुझे बताएं। संयम बनाए रखें।"
        : "I have recorded your status. Let me know if you need immediate medical direction, nearest highway patrol support, or want to trigger dispatch tracking. Stay calm."
    }
  }

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = input
    setInput('')
    
    const newMsgs: Message[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMsgs)
    
    setTimeout(() => {
      const response = getAIResponse(userMsg)
      setMessages(prev => [...prev, response])
      if (isSpeakingEnabled) {
        speak(response.content)
      }
    }, 800)
  }

  // Vision AI crash analyzer simulation
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      setMessages(prev => [...prev, { role: 'user', content: language === 'hi' ? 'मैंने दुर्घटना की तस्वीर अपलोड की है।' : 'I uploaded a crash photo.', imagePreview: base64 }])
      
      setIsAnalyzingImage(true)
      speak(language === 'hi' ? 'दुर्घटना चित्र का एआई विश्लेषण शुरू हो रहा है।' : 'Starting AI vision check of the collision site.')

      setTimeout(() => {
        setIsAnalyzingImage(false)
        const mockResult: Message = {
          role: 'assistant',
          content: language === 'hi' 
            ? "🤖 एआई विजन ने गंभीर संरचनात्मक टक्कर दर्ज की है। वाहन के नुकसान का विवरण नीचे संलग्न है।" 
            : "🤖 AI Vision analysis completed. Frontal structural damage detected. Vehicle damage report attached below.",
          visionResult: {
            damage: language === 'hi' ? 'आगे का बंपर क्षतिग्रस्त, विंडशील्ड दरारें, फ्रंट चेसिस विरूपण।' : 'Deformed front bumper, windshield fractures, front chassis deformation.',
            hazards: language === 'hi' 
              ? ['तेल रिसाव puddle', 'इंजन केबिन धुआं', 'लेन अवरुद्ध'] 
              : ['Oil leakage puddle', 'Slight cabin smoke', 'Obstructed traffic lane'],
            severityScore: 82,
            summary: language === 'hi'
              ? 'आपातकालीन वाहन प्रेषण की पुरजोर सिफारिश की जाती है।'
              : 'Emergency dispatch recommended based on visual impact score.'
          }
        }
        setMessages(prev => [...prev, mockResult])
        if (isSpeakingEnabled) {
          speak(mockResult.content + " " + mockResult.visionResult?.damage)
        }
      }, 3000)
    }
    reader.readAsDataURL(file)
  }

  const startSpeechRecognition = () => {
    if (typeof window === 'undefined') return
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert(language === 'hi' ? 'आपके ब्राउज़र में स्पीच रिकॉग्निशन सपोर्ट नहीं है।' : 'Web Speech API is not supported in this browser.')
      return
    }

    const rec = new SpeechRecognition()
    rec.lang = language === 'hi' ? 'hi-IN' : 'en-US'
    rec.interimResults = false
    rec.maxAlternatives = 1

    rec.onstart = () => {
      setIsListening(true)
      speak(language === 'hi' ? 'मैं सुन रहा हूँ...' : 'Listening...')
    }

    rec.onresult = (event: any) => {
      const speech = event.results[0][0].transcript
      setInput(speech)
      speak(language === 'hi' ? `सुना गया: ${speech}` : `Captured: ${speech}`)
    }

    rec.onerror = () => {
      setIsListening(false)
    }

    rec.onend = () => {
      setIsListening(false)
    }

    rec.start()
  }

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen)
          speak(isOpen ? 'Closing helpdesk' : 'Opening Sarthi helpdesk')
        }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-full shadow-2xl flex items-center justify-center z-50 cursor-pointer border border-white/20"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -45 }} animate={{ rotate: 0 }} exit={{ rotate: 45 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="chat" className="relative" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
              <MessageSquare className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Floating Chat Panel Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[380px] max-w-[90vw] h-[520px] rounded-3xl overflow-hidden z-50 border border-slate-200/50 dark:border-slate-800 shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl flex flex-col text-slate-800 dark:text-white"
          >
            {/* Top National Ribbon */}
            <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-green-500" />

            {/* Official Header */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Traditional Govt Seal watermark in header */}
                <div className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-900 rounded-full shadow border border-slate-200 dark:border-slate-800">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800" fill="none" stroke="currentColor" strokeWidth="1">
                    <circle cx="50" cy="50" r="46" stroke="orange" strokeWidth="1.5" />
                    <circle cx="50" cy="50" r="32" stroke="emerald" strokeWidth="1.5" />
                    <circle cx="50" cy="50" r="10" stroke="blue" strokeWidth="1" />
                    <circle cx="50" cy="50" r="2.5" fill="orange" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight">{t('chatbotTitle')}</h3>
                  <span className="text-[9px] font-bold text-slate-400 block leading-none">{t('ministryLabel')}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Speech Synthesis toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-lg"
                  onClick={() => setIsSpeakingEnabled(!isSpeakingEnabled)}
                  title={isSpeakingEnabled ? 'Mute voice responses' : 'Unmute voice responses'}
                >
                  {isSpeakingEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                </Button>
                <button onClick={() => setIsOpen(false)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Chat Messages Panel */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex gap-2.5 items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-blue-600/10 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-cyan-400 border border-blue-600/20">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div className="flex flex-col space-y-1.5 max-w-[78%]">
                    {msg.imagePreview && (
                      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
                        <img src={msg.imagePreview} alt="Collision upload" className="max-h-32 w-full object-cover" />
                      </div>
                    )}
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-medium'
                        : 'bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 text-slate-800 dark:text-slate-100'
                    }`}>
                      {msg.content}
                    </div>

                    {msg.visionResult && (
                      <div className="p-3 rounded-xl bg-red-500/10 dark:bg-red-500/5 border border-red-500/20 text-[10px] space-y-2 text-slate-850 dark:text-slate-200">
                        <div className="flex items-center justify-between font-bold text-red-500">
                          <span>{t('analysisHeader')}</span>
                          <span className="px-1.5 py-0.5 bg-red-500 text-white rounded text-[8px]">
                            {t('severityLabel')}: {msg.visionResult.severityScore}%
                          </span>
                        </div>
                        <p><strong>{language === 'hi' ? 'क्षति विवरण' : 'Damage Details'}:</strong> {msg.visionResult.damage}</p>
                        <div>
                          <strong>{t('detectedHazardsLabel')}:</strong>
                          <ul className="list-disc pl-3 mt-1 space-y-0.5">
                            {msg.visionResult.hazards.map((h, i) => <li key={i}>{h}</li>)}
                          </ul>
                        </div>
                        <p className="italic text-slate-500 dark:text-slate-400">
                          {msg.visionResult.summary}
                        </p>
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isAnalyzingImage && (
                <div className="flex gap-2.5 items-center justify-start text-[10px] text-slate-400 animate-pulse">
                  <Cpu className="w-4 h-4 text-cyan-400 animate-spin" />
                  <span>Analyzing crash photographs...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestion Pills */}
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/20">
              <div className="flex flex-wrap gap-1.5">
                {examples.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setInput(ex)}
                    className="px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-850 hover:text-blue-600 dark:hover:text-cyan-400 hover:border-blue-300 dark:hover:border-cyan-500/50 transition-colors"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form Panel */}
            <div className="p-3 border-t border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t('chatbotPrompt')}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl pl-4 pr-3 py-2 outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                />
              </div>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />

              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl w-8 h-8 border-slate-200 dark:border-slate-800"
                title="Camera Vision analyze"
              >
                <ImageIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={startSpeechRecognition}
                className={`rounded-xl w-8 h-8 border-slate-200 dark:border-slate-800 ${isListening ? 'bg-red-500/10 border-red-500 animate-pulse' : ''}`}
                title="Voice mic input"
              >
                <Mic className={`w-4 h-4 ${isListening ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`} />
              </Button>

              <Button
                onClick={handleSend}
                size="icon"
                className="rounded-xl w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-500 shadow"
              >
                <Send className="w-4 h-4 text-white" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
