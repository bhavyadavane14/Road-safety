import Navbar from '@/components/layout/navbar'
import About from '@/components/sections/about'
import Footer from '@/components/layout/footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      {/* Subtle India Flag Tricolor gradient lines at top */}
      <div className="absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-orange-500/30 via-white/50 to-green-500/30 z-10 pointer-events-none" />
      
      {/* Subtle national chakra watermark background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.015] dark:opacity-[0.006] pointer-events-none z-0">
        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 dark:text-white" fill="none" stroke="currentColor" strokeWidth="0.5">
          <circle cx="50" cy="50" r="45" />
          <circle cx="50" cy="50" r="10" />
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * Math.PI * 2) / 24
            const x = 50 + Math.cos(angle) * 45
            const y = 50 + Math.sin(angle) * 45
            return <line key={i} x1="50" y1="50" x2={x} y2={y} />
          })}
        </svg>
      </div>

      <Navbar />
      <div className="pt-20 relative z-10">
        <About />
      </div>
      <Footer />
    </div>
  )
}
