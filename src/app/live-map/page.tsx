import Navbar from '@/components/layout/navbar'
import LiveMap from '@/components/sections/live-map'
import Footer from '@/components/layout/footer'

export default function LiveMapPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <div className="pt-20">
        <LiveMap />
      </div>
      <Footer />
    </div>
  )
}
