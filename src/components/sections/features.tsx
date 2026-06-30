'use client'

import { motion } from 'framer-motion'
import { 
  Bot, Mic, Zap, Hospital, Ambulance, ShieldAlert, Contact, PhoneCall, 
  WifiOff, BookOpen, MessageSquare, Timer, HeartPulse, MapPin, 
  TrafficCone, AlertTriangle, Droplets, Truck, Languages, Accessibility 
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useLanguage } from '@/hooks/use-language'

export default function Features() {
  const { language, t } = useLanguage()

  const icons = [
    Bot, Mic, Zap, Hospital, Ambulance, ShieldAlert, Contact, PhoneCall,
    WifiOff, BookOpen, MessageSquare, Timer, HeartPulse, MapPin,
    TrafficCone, AlertTriangle, Droplets, Truck, Languages, Accessibility
  ]

  const featuresEn = [
    { title: 'AI Emergency Assistant', desc: '24/7 AI-powered emergency guidance during road distress.' },
    { title: 'Voice Assistant', desc: 'Hands-free emergency voice commanding for hands-on-wheel scenarios.' },
    { title: 'Accident Detection', desc: 'Automatic crash impact detection using device telemetry APIs.' },
    { title: 'Nearest Hospital Finder', desc: 'Instantly geo-locates level-1 trauma care and ICU beds.' },
    { title: 'Nearest Ambulance', desc: 'Saves time by hailing and tracking local paramedical fleets.' },
    { title: 'Police Locator', desc: 'Finds nearest precinct for legal and collision-report support.' },
    { title: 'Emergency Contacts', desc: 'Bridges alert notifications to pre-configured close contacts.' },
    { title: 'One Tap SOS', desc: 'Triggers global location alert sequence in less than 5 seconds.' },
    { title: 'Offline Emergency Mode', desc: 'Access cached first aid and SMS relays without internet.' },
    { title: 'Road Safety Education', desc: 'Interactive lessons and certification quizzes for safe driving.' },
    { title: 'AI Chatbot', desc: 'Consult safety laws, accident protocols and general insurance query.' },
    { title: 'Golden Hour Guidance', desc: 'Actionable visual timers ensuring actions happen in the first hour.' },
    { title: 'First Aid Assistant', desc: 'Step-by-step illustrations for CPR, bleeding controls, and burns.' },
    { title: 'Live GPS Tracking', desc: 'Secures path routes for ambulance and tracking shares.' },
    { title: 'Traffic Awareness', desc: 'Live congestion updates to optimize emergency responder routes.' },
    { title: 'Road Hazard Alerts', desc: 'Reports potholes, black spots, and highway blockades instantly.' },
    { title: 'Blood Bank Finder', desc: 'Connects you with nearby blood reserves of your group.' },
    { title: 'Vehicle Recovery', desc: 'Access tow trucks, cranes and repair services nearby.' },
    { title: 'Multilingual Support', desc: 'Local translation in Hindi, English and regional languages.' },
    { title: 'Accessibility Features', desc: 'Designed for color-blind, low-vision and one-handed layouts.' },
  ]

  const featuresHi = [
    { title: 'एआई आपातकालीन सहायक', desc: 'सड़क संकट के दौरान 24/7 एआई-संचालित आपातकालीन मार्गदर्शन।' },
    { title: 'आवाज सहायक', desc: 'पहिया-पर-हाथ परिदृश्यों के लिए हाथों से मुक्त आवाज कमांडिंग।' },
    { title: 'दुर्घटना का पता लगाना', desc: 'डिवाइस टेलीमेट्री एपीआई का उपयोग करके स्वचालित क्रैश प्रभाव पहचान।' },
    { title: 'निकटतम अस्पताल खोजक', desc: 'तुरंत स्तर-1 ट्रामा केयर और आईसीयू बेड का पता लगाता है।' },
    { title: 'निकटतम एम्बुलेंस', desc: 'स्थानीय पैरामेडिकल बेड़े को बुलाकर और ट्रैक करके समय बचाता है।' },
    { title: 'पुलिस लोकेटर', desc: 'कानूनी और टक्कर-रिपोर्ट सहायता के लिए निकटतम पुलिस स्टेशन ढूँढे।' },
    { title: 'आपातकालीन संपर्क', desc: 'पूर्व-कॉन्फ़िगर करीबी संपर्कों को अलर्ट सूचनाएं भेजता है।' },
    { title: 'वन टैप एसओएस', desc: '5 सेकंड से भी कम समय में वैश्विक स्थान अलर्ट अनुक्रम को ट्रिगर करता।' },
    { title: 'ऑफलाइन आपातकालीन मोड', desc: 'बिना इंटरनेट के कैश्ड प्राथमिक चिकित्सा और एसएमएस रिले तक पहुंच।' },
    { title: 'सड़क सुरक्षा शिक्षा', desc: 'सुरक्षित ड्राइविंग के लिए पाठ और मार्गनिर्देशों तक पहुँच प्राप्त करें।' },
    { title: 'एआई चैटबॉट', desc: 'सुरक्षा कानूनों, दुर्घटना प्रोटोकॉल और बीमा प्रश्नों पर परामर्श लें।' },
    { title: 'स्वर्णिम घंटा मार्गदर्शन', desc: 'पहले घंटे में त्वरित कार्रवाई सुनिश्चित करने वाले विजुअल टाइमर।' },
    { title: 'प्राथमिक चिकित्सा सहायक', desc: 'सीपीआर, रक्तस्राव नियंत्रण और जलने के लिए चरण-दर-चरण चित्रण।' },
    { title: 'लाइव जीपीएस ट्रैकिंग', desc: 'एम्बुलेंस और ट्रैकिंग शेयर के लिए सुरक्षित मार्ग सुरक्षित करता है।' },
    { title: 'यातायात जागरूकता', desc: 'आपातकालीन प्रतिक्रियाकर्ता मार्गों को अनुकूलित करने के लिए लाइव अपडेट।' },
    { title: 'सड़क खतरा अलर्ट', desc: 'गड्ढों, ब्लैक स्पॉट और राजमार्ग नाकाबंदी की तुरंत रिपोर्ट करता है।' },
    { title: 'ब्लड बैंक खोजक', desc: 'आपको अपने समूह के नजदीकी रक्त भंडार से जोड़ता है।' },
    { title: 'वाहन पुनर्प्राप्ति', desc: 'आसपास के टो ट्रक, क्रेन और मरम्मत सेवाओं तक पहुंच।' },
    { title: 'बहुभाषी सहायता', desc: 'हिंदी, अंग्रेजी और क्षेत्रीय भाषाओं में स्थानीय अनुवाद।' },
    { title: 'सुगम्यता सुविधाएँ', desc: 'कलर-ब्लाइंड, कम-दृष्टि और एक-हाथ वाले लेआउट के लिए डिज़ाइन किया गया।' },
  ]

  const currentFeatures = language === 'hi' ? featuresHi : featuresEn

  const features = currentFeatures.map((f, i) => ({
    icon: icons[i % icons.length],
    title: f.title,
    desc: f.desc
  }))

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-blue-600 to-cyan-500 dark:from-white dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            {t('featuresTitle')}
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('featuresSubtitle')}
          </p>
        </motion.div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 4) * 0.05, duration: 0.5 }}
                whileHover={{ scale: 1.03, y: -6 }}
                className="group relative"
              >
                <Card className="h-full flex flex-col justify-between hover:shadow-2xl transition-all duration-500 border border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
                  <CardHeader className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-md">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <CardDescription className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
