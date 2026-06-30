'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Search, Navigation, Filter, Star, Phone, Route, Eye, ShieldCheck, Siren, Hospital, AlertCircle, CheckCircle } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useAccessibility } from '@/hooks/use-accessibility'
import { useLanguage } from '@/hooks/use-language'
import { cn } from '@/lib/utils'

interface MapMarker {
  id: string
  name: string
  type: 'hospital' | 'police' | 'ambulance' | 'closure'
  latOffset: number // offset from map center
  lngOffset: number
  status?: string
  beds?: number
  phone: string
}

export default function LiveMap() {
  const { language, t } = useLanguage()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [mapMode, setMapMode] = useState<'standard' | 'satellite'>('standard')
  const [filters, setFilters] = useState({
    hospital: true,
    police: true,
    ambulance: true,
    closure: true,
  })

  // Simulated Dispatch Route State
  const [dispatchedAmbulance, setDispatchedAmbulance] = useState<MapMarker | null>(null)
  const [dispatchProgress, setDispatchProgress] = useState(0) // 0 to 1
  const [isDispatching, setIsDispatching] = useState(false)

  // Citizen Session & Incident Report State
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [incidentType, setIncidentType] = useState('closure')
  const [incidentDesc, setIncidentDesc] = useState('')
  const [reportCoords, setReportCoords] = useState<{ x: number; y: number } | null>(null)
  const [isReportedSuccess, setIsReportedSuccess] = useState(false)

  const { speak } = useAccessibility()

  // Static mock locations around center (latOffset, lngOffset in pixels)
  const initialMarkers: MapMarker[] = [
    { id: '1', name: 'Apollo Trauma Care Hospital', type: 'hospital', latOffset: -80, lngOffset: -120, status: '12 Emergency Beds Available', beds: 12, phone: '044-28290200' },
    { id: '2', name: 'Fortis Emergency Center', type: 'hospital', latOffset: 120, lngOffset: 140, status: '5 Emergency Beds Available', beds: 5, phone: '044-42002288' },
    { id: '3', name: 'IIT Madras Medical Clinic', type: 'hospital', latOffset: -30, lngOffset: 100, status: '2 Emergency Beds Available', beds: 2, phone: '044-22578000' },
    { id: '4', name: 'Central Police Precinct Block-B', type: 'police', latOffset: -110, lngOffset: 60, status: '5 Patrol Cars Active', phone: '100' },
    { id: '5', name: 'Highway Patrol Squad 7', type: 'police', latOffset: 70, lngOffset: -150, status: 'On-road dispatch active', phone: '100' },
    { id: '6', name: 'RoadSOS Paramedic Unit 12', type: 'ambulance', latOffset: -60, lngOffset: -50, status: 'Idle - Ready to launch', phone: '102' },
    { id: '7', name: 'RoadSOS Paramedic Unit 4', type: 'ambulance', latOffset: 90, lngOffset: 20, status: 'Idle - Ready to launch', phone: '102' },
    { id: '8', name: 'NH-48 Pothole Reconstruction', type: 'closure', latOffset: -10, lngOffset: -90, status: 'Left lane closed', phone: 'N/A' },
  ]

  const [markers, setMarkers] = useState<MapMarker[]>(initialMarkers)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user')
      if (stored) {
        setUser(JSON.parse(stored))
      }
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const w = canvas.parentElement?.clientWidth || 800
    const h = canvas.parentElement?.clientHeight || 500
    canvas.width = w
    canvas.height = h

    const drawMap = () => {
      ctx.clearRect(0, 0, w, h)
      const centerX = w / 2
      const centerY = h / 2

      // Draw satellite grid or standard vector grid
      if (mapMode === 'satellite') {
        ctx.fillStyle = '#0f172a' // Dark satellite feel
        ctx.fillRect(0, 0, w, h)
        
        ctx.strokeStyle = '#1e293b'
        ctx.lineWidth = 1
        for (let r = 50; r < w; r += 100) {
          ctx.beginPath()
          ctx.arc(centerX + 50, centerY - 50, r, 0, Math.PI * 2)
          ctx.stroke()
        }
      } else {
        ctx.fillStyle = '#f8fafc' // Standard light theme grid
        ctx.fillRect(0, 0, w, h)
        
        ctx.strokeStyle = '#e2e8f0'
        ctx.lineWidth = 0.5
        for (let x = 0; x < w; x += 40) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, h)
          ctx.stroke()
        }
        for (let y = 0; y < h; y += 40) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(w, y)
          ctx.stroke()
        }
      }

      // Draw highway lines
      ctx.strokeStyle = mapMode === 'satellite' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.06)'
      ctx.lineWidth = 24
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      const streets = [
        [{ x: 50, y: centerY }, { x: w - 50, y: centerY }], // E-W Highway
        [{ x: centerX, y: 50 }, { x: centerX, y: h - 50 }], // N-S Highway
        [{ x: 80, y: 80 }, { x: w - 80, y: h - 80 }],       // Diagonal Street
      ]

      streets.forEach((s) => {
        ctx.beginPath()
        ctx.moveTo(s[0].x, s[0].y)
        ctx.lineTo(s[1].x, s[1].y)
        ctx.stroke()
      })

      // Inner road markings
      ctx.strokeStyle = mapMode === 'satellite' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.9)'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 8])
      streets.forEach((s) => {
        ctx.beginPath()
        ctx.moveTo(s[0].x, s[0].y)
        ctx.lineTo(s[1].x, s[1].y)
        ctx.stroke()
      })
      ctx.setLineDash([])

      // Draw emergency search Golden Hour radius
      const pulseTime = Date.now() * 0.0025
      const pulseRadius = 140 + Math.sin(pulseTime) * 10
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.15)'
      ctx.fillStyle = 'rgba(239, 68, 68, 0.02)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      // User Position Dot
      ctx.fillStyle = '#ef4444'
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(centerX, centerY, 9, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      // Pulsing outer blue aura for user locator
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(centerX, centerY, 15 + Math.sin(pulseTime * 2) * 5, 0, Math.PI * 2)
      ctx.stroke()

      // Draw pending reported marker crosshair
      if (reportCoords) {
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(reportCoords.x, reportCoords.y, 14, 0, Math.PI * 2)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(reportCoords.x - 20, reportCoords.y)
        ctx.lineTo(reportCoords.x + 20, reportCoords.y)
        ctx.moveTo(reportCoords.x, reportCoords.y - 20)
        ctx.lineTo(reportCoords.x, reportCoords.y + 20)
        ctx.stroke()
      }

      // Draw Markers
      markers.forEach((m) => {
        // Skip based on filter settings
        if (m.type === 'hospital' && !filters.hospital) return
        if (m.type === 'police' && !filters.police) return
        if (m.type === 'ambulance' && !filters.ambulance) return
        if (m.type === 'closure' && !filters.closure) return

        const mx = centerX + m.lngOffset
        const my = centerY + m.latOffset

        // Pin base dot
        ctx.beginPath()
        ctx.arc(mx, my, 8, 0, Math.PI * 2)
        ctx.fillStyle = 
          m.type === 'hospital' ? '#3b82f6' : 
          m.type === 'police' ? '#eab308' : 
          m.type === 'ambulance' ? '#22c55e' : '#ef4444'
        ctx.fill()
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 2
        ctx.stroke()

        // Outer glow on hovered / selected
        if (selectedMarker?.id === m.id) {
          ctx.strokeStyle = ctx.fillStyle
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(mx, my, 14 + Math.sin(pulseTime * 4) * 2, 0, Math.PI * 2)
          ctx.stroke()
        }
      })

      // Draw Dispatch route line if active
      if (isDispatching && dispatchedAmbulance) {
        const startX = centerX + dispatchedAmbulance.lngOffset
        const startY = centerY + dispatchedAmbulance.latOffset
        
        ctx.strokeStyle = '#22c55e'
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.bezierCurveTo(startX + (centerX - startX) * 0.5, startY, startX, centerY, centerX, centerY)
        ctx.stroke()

        // Draw animated dispatch dot
        const tVal = dispatchProgress
        const cp1x = startX + (centerX - startX) * 0.5
        const cp1y = startY
        const cp2x = startX
        const cp2y = centerY

        // Bezier formula coordinates calculation
        const bx = (1-tVal)**3 * startX + 3*(1-tVal)**2 * tVal * cp1x + 3*(1-tVal) * tVal**2 * cp2x + tVal**3 * centerX
        const by = (1-tVal)**3 * startY + 3*(1-tVal)**2 * tVal * cp1y + 3*(1-tVal) * tVal**2 * cp2y + tVal**3 * centerY

        ctx.fillStyle = '#10b981'
        ctx.beginPath()
        ctx.arc(bx, by, 10, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 2.5
        ctx.stroke()
      }

      animationId = requestAnimationFrame(drawMap)
    }

    drawMap()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [markers, mapMode, filters, selectedMarker, isDispatching, dispatchProgress, reportCoords])

  // Dispatch progress timer
  useEffect(() => {
    if (!isDispatching) return
    const interval = setInterval(() => {
      setDispatchProgress((p) => {
        if (p >= 1) {
          setIsDispatching(false)
          clearInterval(interval)
          speak('Ambulance has reached the accident location. Paramedics starting triage.')
          return 1
        }
        return p + 0.05
      })
    }, 250)
    return () => clearInterval(interval)
  }, [isDispatching])

  const handleMarkerSelect = (m: MapMarker) => {
    setSelectedMarker(m)
    speak(`Inspecting ${m.name}. status is ${m.status}`)
  }

  const triggerDispatch = (amb: MapMarker) => {
    setDispatchedAmbulance(amb)
    setDispatchProgress(0)
    setIsDispatching(true)
    speak(`Dispatching ${amb.name}. Routing ambulance along optimal traffic grid.`)
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Collision detection
    let matched = false
    markers.forEach((m) => {
      const mx = centerX + m.lngOffset
      const my = centerY + m.latOffset
      const distance = Math.sqrt((clickX - mx) ** 2 + (clickY - my) ** 2)
      if (distance < 15) {
        handleMarkerSelect(m)
        matched = true
      }
    })

    if (!matched) {
      setSelectedMarker(null)
      if (user) {
        // Logged in user can click to select custom report position
        setReportCoords({ x: clickX, y: clickY })
        speak(language === 'hi' ? 'दुर्घटना का स्थान चयनित हुआ' : 'Incident report location coordinates pinned.')
      }
    }
  }

  const submitCitizenReport = (e: React.FormEvent) => {
    e.preventDefault()
    if (!incidentDesc.trim() || !reportCoords) return

    const canvas = canvasRef.current
    if (!canvas) return
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    const newMarker: MapMarker = {
      id: String(markers.length + 1),
      name: incidentType === 'closure' ? 'Road Hazard Alert' : 'Vehicle Collision',
      type: incidentType as any,
      latOffset: reportCoords.y - centerY,
      lngOffset: reportCoords.x - centerX,
      status: `Reported by Citizen: ${incidentDesc}`,
      phone: '100'
    }

    setMarkers([...markers, newMarker])
    setIncidentDesc('')
    setReportCoords(null)
    setIsReportedSuccess(true)
    speak(language === 'hi' ? 'दुर्घटना की रिपोर्ट सफलतापूर्वक भेजी गई।' : 'Incident filed successfully. Dispatched radar notifications updated.')
    setTimeout(() => setIsReportedSuccess(false), 4000)
  }

  const filteredMarkers = markers.filter((m) => {
    if (searchQuery) {
      return m.name.toLowerCase().includes(searchQuery.toLowerCase())
    }
    return true
  })

  return (
    <section id="live-map" className="py-24 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="container mx-auto px-6">
        
        {/* Section Title */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-blue-600 to-cyan-500 dark:from-white dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            {t('mapTitle')}
          </h2>
          <p className="text-lg md:text-xl text-slate-650 dark:text-slate-400 max-w-2xl mx-auto">
            {t('mapSubtitle')}
          </p>
        </div>

        {/* Dashboard grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Map Filters & Sidebar Info */}
          <div className="lg:col-span-4 space-y-6 flex flex-col justify-start">
            <Card className="shadow-lg border border-slate-200/50 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <Filter className="w-5 h-5 text-blue-600" />
                  {language === 'hi' ? 'मानचित्र परतें' : 'Map Layers'}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchServicePlaceholder')}
                    className="w-full bg-slate-50 dark:bg-slate-950 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 outline-none text-xs transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                  />
                </div>

                {/* Filters Checkbox */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-center justify-between text-xs font-semibold cursor-pointer">
                    <span className="flex items-center gap-2 text-blue-600">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      {t('hospitalLabel')}
                    </span>
                    <input
                      type="checkbox"
                      checked={filters.hospital}
                      onChange={() => setFilters(f => ({ ...f, hospital: !f.hospital }))}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold cursor-pointer">
                    <span className="flex items-center gap-2 text-yellow-500">
                      <span className="w-2 h-2 rounded-full bg-yellow-505" />
                      {t('policeLabel')}
                    </span>
                    <input
                      type="checkbox"
                      checked={filters.police}
                      onChange={() => setFilters(f => ({ ...f, police: !f.police }))}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold cursor-pointer">
                    <span className="flex items-center gap-2 text-green-500">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      {t('ambulanceLabel')}
                    </span>
                    <input
                      type="checkbox"
                      checked={filters.ambulance}
                      onChange={() => setFilters(f => ({ ...f, ambulance: !f.ambulance }))}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold cursor-pointer">
                    <span className="flex items-center gap-2 text-red-500">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      {t('activeHazards')}
                    </span>
                    <input
                      type="checkbox"
                      checked={filters.closure}
                      onChange={() => setFilters(f => ({ ...f, closure: !f.closure }))}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                  </label>
                </div>

                {/* Map style toggles */}
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant={mapMode === 'standard' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => { setMapMode('standard'); speak('Standard vector map style active') }}
                    className="text-xs font-bold"
                  >
                    {t('vectorMode')}
                  </Button>
                  <Button
                    variant={mapMode === 'satellite' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => { setMapMode('satellite'); speak('Satellite map style active') }}
                    className="text-xs font-bold"
                  >
                    {t('satelliteMode')}
                  </Button>
                </div>

              </CardContent>
            </Card>

            {/* Citizen Incident Report Panel (LOGGED-IN SPECIFIC DIFFERENCE) */}
            <Card className="shadow-lg border border-slate-200/50 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <Siren className="w-4 h-4 text-red-500" />
                  {t('reportIncidentBtn')}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {user ? (
                  <form onSubmit={submitCitizenReport} className="space-y-3.5">
                    {isReportedSuccess && (
                      <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl flex items-center gap-2 border border-emerald-500/20 font-semibold animate-pulse">
                        <CheckCircle className="w-4.5 h-4.5 flex-shrink-0" />
                        <span>{language === 'hi' ? 'दुर्घटना की रिपोर्ट दर्ज हो गई है!' : 'Emergency incident logged successfully!'}</span>
                      </div>
                    )}
                    
                    <div className="text-[10px] text-slate-400">
                      {language === 'hi' ? 'नागरिक नाम' : 'Verified Reporter'}: <span className="font-bold text-slate-250 dark:text-slate-100">{user.name}</span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{language === 'hi' ? 'दुर्घटना प्रकार' : 'Incident Type'}</label>
                      <select 
                        value={incidentType} 
                        onChange={(e) => setIncidentType(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800 outline-none text-xs text-slate-850 dark:text-slate-250 font-semibold"
                      >
                        <option value="closure">{language === 'hi' ? 'सड़क बंद / बाधा' : 'Road Closure / Obstruction'}</option>
                        <option value="ambulance">{language === 'hi' ? 'वाहन टक्कर / दुर्घटना' : 'Vehicle Collision'}</option>
                        <option value="police">{language === 'hi' ? 'सुरक्षा खतरा / गश्ती आवश्यकता' : 'Security Threat'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{language === 'hi' ? 'विवरण' : 'Report Details'}</label>
                      <textarea
                        rows={2}
                        value={incidentDesc}
                        onChange={(e) => setIncidentDesc(e.target.value)}
                        placeholder={language === 'hi' ? 'दुर्घटना विवरण लिखें...' : 'Provide vehicle colors, damage details...'}
                        className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800 outline-none text-xs text-slate-800 dark:text-slate-205"
                        required
                      />
                    </div>

                    <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl text-[10px] text-slate-450 leading-relaxed border border-slate-200 dark:border-slate-850">
                      {reportCoords ? (
                        <span className="text-emerald-500 font-bold">✓ {language === 'hi' ? 'स्थान चयनित: जीपीएस लॉक' : 'GPS Coordinates locked from click.'}</span>
                      ) : (
                        <span className="text-red-500 animate-pulse font-semibold">⚠ {language === 'hi' ? 'नक्शे पर कहीं क्लिक करके स्थान चुनें' : 'Click anywhere on the map grid to set GPS position.'}</span>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-red-600 hover:bg-red-500 text-xs font-bold"
                      disabled={!reportCoords}
                    >
                      {language === 'hi' ? 'आपातकालीन प्रेषण भेजें' : 'Dispatch Dispatch Radar'}
                    </Button>
                  </form>
                ) : (
                  <div className="p-4 bg-slate-50 dark:bg-slate-955 rounded-2xl text-center space-y-2 border border-slate-200/50 dark:border-slate-800/80">
                    <AlertCircle className="w-6 h-6 text-red-500 mx-auto" />
                    <p className="text-[11px] text-slate-500 dark:text-slate-450 leading-relaxed">
                      {t('loginToReportMsg')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Selected Marker Details */}
            <AnimatePresence mode="wait">
              {selectedMarker ? (
                <motion.div
                  key={selectedMarker.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                >
                  <Card className="border border-cyan-500/20 shadow-xl bg-slate-900 text-white">
                    <CardHeader className="pb-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                        {language === 'hi' ? 'सक्रिय नोड का विवरण' : 'Emergency Node Inspected'}
                      </span>
                      <CardTitle className="text-xl font-bold flex items-center gap-2">
                        {selectedMarker.type === 'hospital' && <Hospital className="w-5 h-5 text-blue-400" />}
                        {selectedMarker.type === 'police' && <ShieldCheck className="w-5 h-5 text-yellow-400" />}
                        {selectedMarker.type === 'ambulance' && <Siren className="w-5 h-5 text-green-400" />}
                        {selectedMarker.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-slate-300">
                        {language === 'hi' ? 'स्थिति' : 'Status'}: <span className="text-white font-semibold">{selectedMarker.status}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <a 
                          href={`tel:${selectedMarker.phone}`}
                          className={cn(buttonVariants({ variant: 'glass', size: 'sm' }), "flex-1 flex items-center justify-center gap-1.5")}
                        >
                          <Phone className="w-4 h-4" />
                          {language === 'hi' ? 'कॉल करें' : 'Call Node'}
                        </a>
                        {selectedMarker.type === 'ambulance' && (
                          <Button 
                            variant="sos" 
                            size="sm" 
                            onClick={() => triggerDispatch(selectedMarker)}
                            className="flex-1"
                            disabled={isDispatching}
                          >
                            <Route className="w-4 h-4 mr-1.5" />
                            {t('dispatchAmbulanceBtn')}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <Card className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 text-center text-slate-500 text-xs leading-relaxed">
                  {language === 'hi' ? 'लाइव समन्वय जानकारी प्राप्त करने के लिए मानचित्र पर किसी पिन पर क्लिक करें।' : 'Click any node pin on the map grid to trigger live coordination details.'}
                </Card>
              )}
            </AnimatePresence>
          </div>

          {/* Interactive Map Canvas Grid */}
          <div className="lg:col-span-8 relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white min-h-[450px]">
            <canvas 
              ref={canvasRef} 
              className="w-full h-full block cursor-crosshair"
              onClick={handleCanvasClick}
            />

            {/* Floating Quick Stats */}
            <div className="absolute bottom-6 left-6 pointer-events-none space-y-2">
              <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800 text-xs text-white flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <div className="font-mono text-[10px]">
                  ACTIVE GPS: <span className="font-bold text-green-400">12.9716, 77.5946</span>
                </div>
              </div>
            </div>

            {/* GPS Lock button */}
            <button 
              onClick={() => {
                setSelectedMarker(null)
                setReportCoords(null)
                speak('Coordinates locked onto current user location.')
              }}
              className="absolute bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
              title="Lock GPS Position"
            >
              <Navigation className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  )
}
