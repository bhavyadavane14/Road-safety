import Navbar from '@/components/layout/navbar'
import Dashboard from '@/components/sections/dashboard'
import Footer from '@/components/layout/footer'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <div className="pt-20">
        <Dashboard />
      </div>
      <Footer />
    </div>
  )
}
