'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Navigation, Bell, MessageSquare, Volume2, Route, Truck } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'

export default function SOSFlow() {
  const { t } = useLanguage()

  const steps = [
    { icon: MapPin, title: t('sosStep1Title'), desc: t('sosStep1Desc') },
    { icon: MessageSquare, title: t('sosStep2Title'), desc: t('sosStep2Desc') },
    { icon: Truck, title: t('sosStep3Title'), desc: t('sosStep3Desc') },
    { icon: Route, title: t('sosStep4Title'), desc: t('sosStep4Desc') },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-955 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-slate-900 via-red-600 to-orange-500 dark:from-white dark:via-red-400 dark:to-orange-400 bg-clip-text text-transparent">
            {t('sosFlowTitle')}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('sosFlowSubtitle')}
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-red-500 transform -translate-y-1/2 rounded-full" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="relative"
              >
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-200/50 dark:border-slate-800 text-center relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight">{step.title}</h3>
                  </div>
                  <p className="text-xs text-slate-650 dark:text-slate-450 leading-relaxed mt-2">{step.desc}</p>
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-extrabold text-sm shadow-lg border border-white dark:border-slate-800">
                    {index + 1}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
