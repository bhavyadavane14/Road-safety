'use client'

import { motion } from 'framer-motion'
import { User, Server, Key, BrainCircuit, Database, Network, Bell, LayoutDashboard, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/hooks/use-language'

export default function Architecture() {
  const { t } = useLanguage()

  const nodes = [
    { id: '1', title: 'Incident User / Telemetry', icon: User, desc: 'SOS button trigger, crash sensor coordinates, or crash photo uploads.', color: 'bg-red-500' },
    { id: '2', title: 'Next.js Frontend Client', icon: LayoutDashboard, desc: 'Responsive Apple-style Glassmorphism UI with multi-lingual and speech assist.', color: 'bg-blue-600' },
    { id: '3', title: 'API Gateway Proxy', icon: Server, desc: 'Load balancing, rate limiters, and HTTPS proxies routing requests.', color: 'bg-purple-600' },
    { id: '4', title: 'JWT Security & Role Auth', icon: Key, desc: 'Access validation separating User profiles, First-Responders, and Admins.', color: 'bg-yellow-500' },
    { id: '5', title: 'AI Severity Reasoning Engine', icon: BrainCircuit, desc: 'Gemini, YOLO crash detection, Whisper voice translation APIs.', color: 'bg-cyan-500' },
    { id: '6', title: 'Incident Datastores (MongoDB)', icon: Database, desc: 'Geo-indexed schemas tracking Hospitals, Ambulances, and Police precincts.', color: 'bg-emerald-600' },
    { id: '7', title: 'Emergency Dispatch APIs', icon: Network, desc: 'Third-party GPS routing engines plotting paramedical response routes.', color: 'bg-blue-500' },
    { id: '8', title: 'Notification System', icon: Bell, desc: 'Twilio SMS gateway alerting emergency contacts and hospital triage units.', color: 'bg-orange-500' },
    { id: '9', title: 'Real-time Dashboards', icon: LayoutDashboard, desc: 'Socket.io servers pushing instant coordinate streams to admin HUD panels.', color: 'bg-pink-600' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  return (
    <section id="technology" className="py-24 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider border border-blue-200/50">
            System Design Architecture
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-blue-600 to-cyan-500 dark:from-white dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Platform Architecture
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A production-ready decoupled ecosystem optimized for zero-lag emergency coordination.
          </p>
        </div>

        {/* Visual pipeline */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {nodes.map((node, index) => {
            const NodeIcon = node.icon
            return (
              <motion.div
                key={node.id}
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -4 }}
                className="relative"
              >
                <Card className="h-full flex flex-col justify-between border border-slate-200/50 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl hover:shadow-xl transition-all duration-300">
                  <CardHeader className="flex flex-row items-center gap-4 pb-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white ${node.color} shadow-md`}>
                      <NodeIcon className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">PIPELINE NODE 0{index + 1}</span>
                      <CardTitle className="text-base font-bold text-slate-950 dark:text-white mt-0.5">
                        {node.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {node.desc}
                    </p>
                  </CardContent>
                </Card>

                {/* Connection Arrow for larger screens (except the last item) */}
                {index < nodes.length - 1 && (
                  <div className="hidden lg:block absolute -right-4.5 top-1/2 -translate-y-1/2 z-10 text-slate-300 dark:text-slate-700 pointer-events-none">
                    {/* Only draw arrow on items not at end of row */}
                    {(index + 1) % 3 !== 0 && (
                      <ArrowRight className="w-5 h-5 animate-pulse" />
                    )}
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>

        {/* Security Summary banner */}
        <div className="mt-12 bg-slate-950/80 border border-slate-850/80 rounded-3xl p-8 max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-left space-y-1">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              Security Integrity Measures
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              Equipped with SQL injection shielding, CSRF token verifications, XSS sanitation blockades, rate-limiting on endpoints, and end-to-end HTTPS payload encryption.
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg bg-emerald-500/5">
            SSL CERTIFIED • JWT PROTECTED
          </span>
        </div>

      </div>
    </section>
  )
}
