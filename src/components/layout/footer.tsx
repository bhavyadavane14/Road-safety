'use client'

import { motion } from 'framer-motion'
import { AlertCircle, ShieldCheck, HelpCircle, Mail, Phone, ExternalLink } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'
import { EMERGENCY_NUMBERS } from '@/lib/constants'

export default function Footer() {
  const { t } = useLanguage()

  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: t('home'), href: '#home' },
    { name: t('features'), href: '#features' },
    { name: t('aiAssistant'), href: '#ai' },
    { name: t('dashboard'), href: '#dashboard' },
    { name: t('technology'), href: '#technology' },
  ]

  const resourceLinks = [
    { name: 'Road Safety Manual', href: '#' },
    { name: 'First Aid Protocols', href: '#' },
    { name: 'Developer API Logs', href: '#' },
    { name: 'AI Severity Training Dataset', href: '#' },
  ]

  const legalLinks = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Compliance Registry', href: '#' },
  ]

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-8 relative overflow-hidden">
      {/* Decorative pulse glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white leading-none">RoadSOS AI</span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Ministry of Road Transport</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Every Second Saves a Life. RoadSOS AI is a digital twin and real-time AI emergency dispatcher developed for the Government of India to maximize Golden Hour survival rates.
            </p>
            <div className="flex items-center gap-3 text-xs bg-slate-800/80 border border-slate-700/50 p-4 rounded-xl max-w-sm">
              <ShieldCheck className="w-6 h-6 text-green-400 flex-shrink-0" />
              <span>Certified under Digital India Road Safety Standards Act & ISO 27001 Security.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-blue-400 hover:underline transition-colors flex items-center gap-1">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Documentation</h4>
            <ul className="space-y-2 text-sm">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-blue-400 hover:underline transition-colors flex items-center gap-1">
                    {link.name}
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Hotlines */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider text-red-400 flex items-center gap-2">
              <Phone className="w-4 h-4" /> Emergency Numbers
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/30">
                <p className="text-slate-400">Police</p>
                <a href={`tel:${EMERGENCY_NUMBERS.police}`} className="text-white text-base font-bold hover:text-blue-400">
                  {EMERGENCY_NUMBERS.police}
                </a>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/30">
                <p className="text-slate-400">Ambulance</p>
                <a href={`tel:${EMERGENCY_NUMBERS.ambulance}`} className="text-white text-base font-bold hover:text-blue-400">
                  {EMERGENCY_NUMBERS.ambulance}
                </a>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/30">
                <p className="text-slate-400">Fire</p>
                <a href={`tel:${EMERGENCY_NUMBERS.fire}`} className="text-white text-base font-bold hover:text-blue-400">
                  {EMERGENCY_NUMBERS.fire}
                </a>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/30">
                <p className="text-slate-400">Women Helpline</p>
                <a href={`tel:${EMERGENCY_NUMBERS.women}`} className="text-white text-base font-bold hover:text-blue-400">
                  {EMERGENCY_NUMBERS.women}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Partners */}
        <div className="border-t border-slate-800 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap items-center gap-6 opacity-60 text-xs">
            <span className="font-bold uppercase tracking-wider">Government Partners:</span>
            <span>Ministry of Road Transport & Highways (MoRTH)</span>
            <span>National Health Authority (NHA)</span>
            <span>Digital India Initiative</span>
            <span>IIT Madras Road Safety Hub</span>
          </div>
          <div className="text-xs text-slate-500">
            &copy; {currentYear} RoadSOS AI. Created for IIT Madras Road Safety Hackathon. All rights reserved.
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="text-[10px] text-slate-600 border-t border-slate-800/50 pt-6 text-center leading-relaxed">
          Disclaimer: RoadSOS AI utilizes advanced simulated machine learning and real-time mapping for demonstration purposes in road safety analysis and Golden Hour emergency operations.
        </div>
      </div>
    </footer>
  )
}
