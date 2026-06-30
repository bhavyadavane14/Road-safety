'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Activity, Siren, Volume2, ShieldAlert, Zap, Droplet, Skull } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAccessibility } from '@/hooks/use-accessibility'
import { useLanguage } from '@/hooks/use-language'
import { cn } from '@/lib/utils'

interface FirstAidTopic {
  id: string
  title: string
  icon: any
  color: string
  description: string
  steps: string[]
  narration: string
}

export default function FirstAid() {
  const { language, t } = useLanguage()
  const [activeTopic, setActiveTopic] = useState<string>('cpr')
  const [metronomeActive, setMetronomeActive] = useState(false)
  const [beat, setBeat] = useState(false)
  const metronomeTimer = useRef<NodeJS.Timeout | null>(null)
  
  const { speak, stopSpeaking } = useAccessibility()

  const topicsEn: FirstAidTopic[] = [
    {
      id: 'cpr',
      title: 'CPR (Cardiopulmonary Resuscitation)',
      icon: Heart,
      color: 'bg-red-500',
      description: 'Used when a person is unconscious and not breathing normally.',
      steps: [
        'Place the heel of one hand in the center of the chest.',
        'Place your other hand on top and interlock fingers.',
        'Compress the chest at a rate of 100-120 beats per minute.',
        'Push down at least 2 inches (5 cm) deep.',
        'Allow the chest to recoil fully between compressions.',
        'Minimize pauses in compressions.'
      ],
      narration: 'For CPR, place the heel of one hand in the center of the chest, interlock your other hand on top, and push hard and fast at a speed of one hundred and ten compressions per minute.'
    },
    {
      id: 'bleeding',
      title: 'Severe Bleeding Control',
      icon: Droplet,
      color: 'bg-red-600',
      description: 'Stops hemorrhagic blood loss to prevent circulatory shock.',
      steps: [
        'Apply direct firm pressure to the wound with a clean sterile cloth.',
        'Keep the victim lying down to improve blood flow to vital organs.',
        'If blood leaks through, apply another cloth layer without removing the first.',
        'Elevate the injured limb above heart level if no fractures are suspected.',
        'Wrap a pressure bandage firmly but not tight enough to cut off circulation.'
      ],
      narration: 'Apply direct pressure on the bleeding wound with a clean cloth. Elevate the limb and do not remove saturated dressing. Apply a secondary wrap.'
    },
    {
      id: 'burn',
      title: 'Severe Burns & Scalds',
      icon: Zap,
      color: 'bg-orange-500',
      description: 'Cools thermal skin damage and prevents critical infection.',
      steps: [
        'Immediately cool the burn under cool, running water for 10-20 minutes.',
        'Do not apply ice, butter, toothpaste or ointments, as they trap heat.',
        'Remove rings or tight clothing before swelling starts.',
        'Cover the burn loosely with a clean plastic wrap or non-stick dressing.',
        'Treat for shock: keep the patient warm and flat.'
      ],
      narration: 'Cool the burn with running water. Do not apply ice, paste or oils. Cover loosely with non stick plastic wrap.'
    },
    {
      id: 'fracture',
      title: 'Bone Fractures & Splinting',
      icon: Activity,
      color: 'bg-blue-500',
      description: 'Stabilizes suspected bone breaks to prevent nerve damage.',
      steps: [
        'Keep the injured limb as still as possible. Do not attempt to realign the bone.',
        'Support the limb with splints made of rolled newspapers, cardboard, or wood.',
        'Secure the splints with bandages or strips of cloth, but do not bind too tight.',
        'Apply ice wrapped in a towel to reduce swelling (avoid direct contact with skin).',
        'Assess for sensation, warmth, and pulse below the fracture site.'
      ],
      narration: 'Immobilize the fractured limb using cardboard or wood splints. Do not move the bone. Apply ice to manage swelling.'
    },
    {
      id: 'snake',
      title: 'Venomous Snake Bites',
      icon: Skull,
      color: 'bg-emerald-600',
      description: 'First aid treatment for neurotoxic and hemotoxic snake bites.',
      steps: [
        'Move the victim away from the snake to safety.',
        'Keep the victim calm and completely still to slow the spread of venom.',
        'Do not cut, suck out venom, or apply a tight tourniquet (use pressure immobilization instead).',
        'Remove any jewelry or tight clothing near the bite before swelling begins.',
        'Keep the bite site located below or at heart level.'
      ],
      narration: 'Keep the snake bite victim calm and motionless. Do not cut or suck the wound. Immobilize the limb below heart level.'
    }
  ]

  const topicsHi: FirstAidTopic[] = [
    {
      id: 'cpr',
      title: 'सीपीआर (कार्डियोपल्मोनरी रिससिटेशन)',
      icon: Heart,
      color: 'bg-red-500',
      description: 'इसका उपयोग तब किया जाता है जब कोई व्यक्ति बेहोश हो और सांस नहीं ले रहा हो।',
      steps: [
        'हथेली के निचले हिस्से को छाती के बीच में रखें।',
        'अपने दूसरे हाथ को ऊपर रखें और उंगलियों को आपस में फंसाएं।',
        '100-120 बार प्रति मिनट की दर से छाती को दबाएं।',
        'कम से कम 2 इंच (5 सेमी) गहरा दबाएं।',
        'दबावों के बीच छाती को पूरी तरह वापस सामान्य स्थिति में आने दें।',
        'दबाव प्रक्रिया में रुकावट को न्यूनतम करें।'
      ],
      narration: 'सीपीआर के लिए, एक हाथ की हथेली को छाती के बीच में रखें, दूसरे हाथ को ऊपर से इंटरलॉक करें और प्रति मिनट एक सौ दस कंप्रेशन की दर से तेजी से दबाएं।'
    },
    {
      id: 'bleeding',
      title: 'गंभीर रक्तस्राव नियंत्रण',
      icon: Droplet,
      color: 'bg-red-600',
      description: 'रक्तस्राव के कारण होने वाली हानि को रोकने के लिए दबाव लागू करें।',
      steps: [
        'साफ कपड़े या पट्टी से घाव पर सीधा मजबूत दबाव डालें।',
        'महत्वपूर्ण अंगों में रक्त प्रवाह बनाए रखने के लिए मरीज को लेटाकर रखें।',
        'यदि रक्त रिसता है, तो पहले कपड़े को हटाए बिना दूसरा कपड़ा रखें।',
        'यदि संभव हो तो चोटिल हिस्से को दिल के स्तर से ऊपर उठाएं।',
        'दबाव पट्टी को मजबूती से लपेटें।'
      ],
      narration: 'साफ कपड़े से बहते खून पर सीधा दबाव डालें। घाव को हृदय स्तर से ऊपर उठाएं।'
    },
    {
      id: 'burn',
      title: 'गंभीर जलन और छाले',
      icon: Zap,
      color: 'bg-orange-500',
      description: 'त्वचा के नुकसान को कम करने और संक्रमण को रोकने के लिए।',
      steps: [
        'जले हुए हिस्से को 10-20 मिनट के लिए बहते पानी के नीचे ठंडा करें।',
        'बर्फ, मक्खन, टूथपेस्ट या मलहम न लगाएं क्योंकि ये गर्मी को रोकते हैं।',
        'सूजन शुरू होने से पहले टाइट कपड़े या अंगूठी हटा दें।',
        'जले हुए हिस्से को प्लास्टिक रैप या साफ पट्टी से ढीला ढकें।',
        'सदमे के लिए इलाज करें: मरीज को गर्म और समतल रखें।'
      ],
      narration: 'बहते पानी से जलन को ठंडा करें। बर्फ या तेल न लगाएं। प्लास्टिक रैप से ढीला ढकें।'
    },
    {
      id: 'fracture',
      title: 'हड्डी का टूटना और पट्टी बांधना',
      icon: Activity,
      color: 'bg-blue-500',
      description: 'संदिग्ध हड्डी के फ्रैक्चर को स्थिर करने के लिए।',
      steps: [
        'चोटिल हिस्से को जितना संभव हो उतना स्थिर रखें।',
        'कार्डबोर्ड, लकड़ी या अखबार की पट्टियों से अंग को सहारा दें।',
        'पट्टियों को साफ कपड़े से बांधें, लेकिन बहुत टाइट न बांधें।',
        'सूजन कम करने के लिए कपड़े में लपेटकर बर्फ लगाएं।',
        'फ्रैक्चर के नीचे संवेदना और नाड़ी की जांच करें।'
      ],
      narration: 'कार्डबोर्ड या लकड़ी की पट्टियों का उपयोग करके टूटे हुए हिस्से को स्थिर रखें।'
    },
    {
      id: 'snake',
      title: 'जहरीले सांप का काटना',
      icon: Skull,
      color: 'bg-emerald-600',
      description: 'सांप काटने के बाद का पहला इलाज।',
      steps: [
        'पीड़ित को सुरक्षित स्थान पर ले जाएं।',
        'जहर फैलने से रोकने के लिए मरीज को पूरी तरह शांत और स्थिर रखें।',
        'घाव को काटें नहीं, जहर चूसें नहीं, न ही कोई टाइट पट्टी बांधें।',
        'सूजन शुरू होने से पहले गहने या टाइट कपड़े हटा दें।',
        'घाव को दिल के स्तर से नीचे रखें।'
      ],
      narration: 'सांप काटने के शिकार को पूरी तरह शांत रखें। घाव को चूसें या काटें नहीं।'
    }
  ]

  const topicsMr: FirstAidTopic[] = [
    {
      id: 'cpr',
      title: 'सीपीआर (CPR)',
      icon: Heart,
      color: 'bg-red-500',
      description: 'व्यक्ती बेशुद्ध असताना आणि सामान्यपणे श्वास घेत नसताना वापरले जाते.',
      steps: [
        'एका हाताचा तळवा छातीच्या मध्यभागी ठेवा.',
        'दुसरा हात वर ठेवा आणि बोटे गुंफून घ्या.',
        'प्रति मिनिट १००-१२० वेळा दाबा.',
        'किमान २ इंच (५ सेमी) खोल दाबा.',
        'दाबांच्या दरम्यान छाती पूर्णपणे परत सामान्य स्थितीत येऊ द्या.',
        'दाबण्याच्या प्रक्रियेत कमीत कमी व्यत्यय आणा.'
      ],
      narration: 'सीपीआरसाठी छातीच्या मध्यभागी हाताचा तळवा ठेवा आणि प्रति मिनिट ११० वेळा वेगाने दाबा.'
    },
    {
      id: 'bleeding',
      title: 'रक्तस्त्राव नियंत्रण',
      icon: Droplet,
      color: 'bg-red-600',
      description: 'गंभीर रक्तस्त्राव रोखण्यासाठी त्वरित पावले.',
      steps: [
        'स्वच्छ कपड्याने थेट जखमेवर दाब द्या.',
        'अवयवांना रक्त पुरवठा सुरळीत ठेवण्यासाठी रुग्णाला झोपवून ठेवा.',
        'रक्त कापडातून बाहेर आल्यास, पहिल्या कापडाला न काढता त्यावर दुसरे कापड ठेवा.',
        'शक्य असल्यास जखम हृदय पातळीच्या वर उचला.',
        'दाब पट्टी व्यवस्थित गुंडाळा.'
      ],
      narration: 'स्वच्छ कापडाने थेट जखमेवर दाब द्या आणि जखम उंचावर ठेवा.'
    },
    {
      id: 'burn',
      title: 'जलन आणि भाजणे',
      icon: Zap,
      color: 'bg-orange-500',
      description: 'त्वचेचे नुकसान कमी करण्यासाठी आणि संसर्ग रोखण्यासाठी.',
      steps: [
        'भाजलेला भाग त्वरित १०-२० मिनिटे थंड पाण्याखाली ठेवा.',
        'बर्फ, तूप, टूथपेस्ट लावू नका.',
        'सूज येण्यापूर्वी घट्ट कपडे किंवा अंगठी काढून टाका.',
        'भाजलेला भाग प्लास्टिक रॅप किंवा स्वच्छ पट्टीने सैल झाकून ठेवा.',
        'रुग्णाला समतल आणि उबदार ठेवा.'
      ],
      narration: 'भाजलेला भाग थंड पाण्याखाली धुवून सैल प्लास्टिक पट्टीने झाकून ठेवा.'
    }
  ]

  const getTopics = (): FirstAidTopic[] => {
    if (language === 'hi') return topicsHi
    if (language === 'mr') return topicsMr
    return topicsEn // defaults to English for other languages
  }

  const topics = getTopics()
  const activeData = topics.find(t => t.id === activeTopic) || topics[0]

  // CPR Metronome simulation beating at 110 BPM (approx 545ms per interval)
  useEffect(() => {
    if (metronomeActive) {
      speak(language === 'hi' ? 'मेट्रोनोम सक्रिय। ब्लिंकिंग लाइट के साथ छाती दबाएं।' : 'Metronome active. Align chest compressions with the blinking pulse.')
      metronomeTimer.current = setInterval(() => {
        setBeat(true)
        setTimeout(() => setBeat(false), 120)
      }, 545)
    } else {
      if (metronomeTimer.current) clearInterval(metronomeTimer.current)
      setBeat(false)
    }

    return () => {
      if (metronomeTimer.current) clearInterval(metronomeTimer.current)
    }
  }, [metronomeActive])

  const triggerVoiceNarration = () => {
    stopSpeaking()
    setTimeout(() => {
      speak(activeData.narration)
    }, 150)
  }

  return (
    <section id="first-aid" className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-blue-600 to-cyan-500 dark:from-white dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            {t('firstAidTitle')}
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('firstAidSubtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          
          {/* Side Tabs Trigger list */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {topics.map((topic) => {
              const IconComp = topic.icon
              const isActive = topic.id === activeTopic
              return (
                <button
                  key={topic.id}
                  onClick={() => {
                    setActiveTopic(topic.id)
                    setMetronomeActive(false)
                    speak(topic.title)
                  }}
                  className={cn(
                    'w-full flex items-center gap-4 p-4.5 rounded-2xl text-left border transition-all duration-300',
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl scale-[1.02] border-transparent'
                      : 'bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shadow-md', isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800')}>
                    <IconComp className={cn('w-5.5 h-5.5', isActive ? 'text-white' : 'text-slate-600 dark:text-slate-400')} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{topic.title}</h4>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Active Instructions Card */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <Card className="border border-slate-200/50 dark:border-slate-800 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl h-full flex flex-col justify-between p-6">
              
              {/* Header */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-extrabold uppercase bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
                    {language === 'hi' ? 'चरण-दर-चरण निर्देश' : 'Step-by-Step Triage'}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-3">
                    {activeData.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {activeData.description}
                  </p>
                </div>
                
                {/* Voice Narration btn */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={triggerVoiceNarration}
                  className="flex items-center gap-1.5 text-xs border-slate-200 dark:border-slate-800"
                >
                  <Volume2 className="w-4 h-4" />
                  {language === 'hi' ? 'निर्देश बोलें' : 'Speak Steps'}
                </Button>
              </div>

              {/* Steps list */}
              <div className="my-6 space-y-3 flex-1">
                {activeData.steps.map((step, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={idx} 
                    className="flex items-start gap-4 p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800/85"
                  >
                    <span className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {step}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Action panels (including CPR metronome) */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row gap-4 items-center justify-between">
                
                {/* CPR Metronome Widget */}
                {activeData.id === 'cpr' ? (
                  <div className="flex items-center gap-4 bg-red-500/10 dark:bg-red-500/5 border border-red-500/20 px-4 py-3 rounded-2xl w-full sm:w-auto">
                    <motion.div 
                      animate={{ scale: beat ? 1.3 : 1 }}
                      className={`w-6.5 h-6.5 rounded-full flex items-center justify-center ${beat ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]' : 'bg-slate-300 dark:bg-slate-700'}`}
                    >
                      <Activity className="w-4 h-4 text-white" />
                    </motion.div>
                    
                    <div className="text-left">
                      <span className="text-[10px] text-red-500 font-extrabold uppercase block tracking-wider leading-none">
                        {language === 'hi' ? 'सीपीआर गति सहायक' : 'CPR Pace Assist'}
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">110 Compressions/Min</span>
                    </div>

                    <Button 
                      variant={metronomeActive ? 'destructive' : 'outline'}
                      size="sm" 
                      onClick={() => setMetronomeActive(!metronomeActive)}
                      className="ml-auto"
                    >
                      {metronomeActive ? t('metronomeBtnStop') : t('metronomeBtnStart')}
                    </Button>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic">
                    {language === 'hi' 
                      ? 'प्राथमिक चिकित्सा प्रक्रियाओं के साथ हमेशा तत्काल आपातकालीन चिकित्सा सेवाओं से संपर्क करें।' 
                      : 'Always seek medical emergency services immediately alongside first aid procedures.'}
                  </div>
                )}

                {/* Direct Hotline button */}
                <a 
                  href="tel:102"
                  className={cn(buttonVariants({ variant: 'sos' }), "flex items-center gap-1.5 shadow-md w-full sm:w-auto")}
                >
                  <Siren className="w-4.5 h-4.5 text-white" />
                  {language === 'hi' ? 'एम्बुलेंस बुलाएं (102)' : 'Call Ambulance (102)'}
                </a>
              </div>

            </Card>
          </div>

        </div>

      </div>
    </section>
  )
}
