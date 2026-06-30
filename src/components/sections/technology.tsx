'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const techStacks = {
  frontend: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Shadcn UI', 'Three.js', 'Mapbox'],
  backend: ['Node.js', 'Express', 'FastAPI', 'JWT', 'Redis', 'Socket.io'],
  database: ['PostgreSQL', 'MongoDB', 'Supabase', 'Firebase'],
  ai: ['Gemini', 'OpenAI', 'LangChain', 'Pinecone', 'Whisper', 'YOLO', 'OCR'],
  cloud: ['Vercel', 'Render', 'Firebase', 'AWS', 'Docker'],
}

export default function Technology() {
  return (
    <section id="technology" className="py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-blue-600 bg-clip-text text-transparent">
            Technology Stack
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Built with cutting-edge technologies for maximum performance and reliability
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(techStacks).map(([category, technologies], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-300 border-white/40">
                <CardHeader>
                  <CardTitle className="capitalize text-xl">{category}</CardTitle>
                  <CardDescription>Core technologies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
