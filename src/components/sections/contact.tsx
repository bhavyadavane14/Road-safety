'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/hooks/use-language'

export default function Contact() {
  const { t } = useLanguage()

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-slate-900 via-blue-600 to-cyan-500 dark:from-white dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            {t('contactTitle')}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('contactSubtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Card className="shadow-xl border border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{t('email')}</h3>
                    <p className="text-slate-650 dark:text-slate-400 text-sm">support@roadsos.gov.in</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center shadow-lg">
                    <Phone className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{t('emergency')}</h3>
                    <p className="text-slate-655 dark:text-slate-400 text-sm">1800-123-7654 (Toll Free)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center shadow-lg">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{t('address')}</h3>
                    <p className="text-slate-650 dark:text-slate-400 text-sm">{t('addressVal')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="shadow-xl border border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-2">{t('nameLabel')}</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-slate-950 dark:text-white outline-none transition-all text-sm"
                      placeholder={t('nameLabel')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-2">{t('emailLabel')}</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-slate-950 dark:text-white outline-none transition-all text-sm"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-2">{t('messageLabel')}</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-slate-950 dark:text-white outline-none transition-all resize-none text-sm"
                      placeholder="..."
                    />
                  </div>
                  <Button className="w-full" size="lg">
                    <Send className="w-5 h-5 mr-2" />
                    {t('sendBtn')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
