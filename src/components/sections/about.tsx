'use client'

import { motion } from 'framer-motion'
import { Shield, Heart, Zap, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/hooks/use-language'

export default function About() {
  const { t } = useLanguage()

  const values = [
    { icon: Shield, title: t('value1Title'), desc: t('value1Desc') },
    { icon: Heart, title: t('value2Title'), desc: t('value2Desc') },
    { icon: Zap, title: t('value3Title'), desc: t('value3Desc') },
    { icon: Users, title: t('value4Title'), desc: t('value4Desc') },
  ]

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-slate-900 via-blue-600 to-cyan-500 dark:from-white dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            {t('aboutTitle')}
          </h2>
          <p className="text-lg md:text-xl text-slate-650 dark:text-slate-350 max-w-3xl mx-auto leading-relaxed">
            {t('aboutSubtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.04, y: -8 }}
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-300 border border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-center text-slate-900 dark:text-white font-bold">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{value.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Impact Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 rounded-3xl p-12 text-white text-center shadow-xl border border-blue-500/10"
        >
          <h3 className="text-3xl font-extrabold mb-8 uppercase tracking-wide">{t('impactTitle')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '120K+', label: t('livesSaved') },
              { value: '18K+', label: t('hospitals') },
              { value: '30K+', label: t('ambulances') },
              { value: '100+', label: t('cities') },
            ].map((stat, index) => (
              <div key={index} className="space-y-1">
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 font-mono tracking-tight">{stat.value}</div>
                <div className="text-slate-300 font-semibold text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
