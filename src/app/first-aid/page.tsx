import Navbar from '@/components/layout/navbar'
import FirstAid from '@/components/sections/first-aid'
import Footer from '@/components/layout/footer'

export default function FirstAidPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <div className="pt-20">
        <FirstAid />
      </div>
      <Footer />
    </div>
  )
}
