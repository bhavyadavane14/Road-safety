'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, UserCheck, ShieldAlert, HeartPulse, Building2, 
  MapPin, Send, Plus, Trash2, CheckCircle2, Siren, Plane 
} from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'
import { useAccessibility } from '@/hooks/use-accessibility'

const accidentData = [
  { month: 'Jan', accidents: 1200, resolved: 1100 },
  { month: 'Feb', accidents: 1100, resolved: 1050 },
  { month: 'Mar', accidents: 1300, resolved: 1250 },
  { month: 'Apr', accidents: 1150, resolved: 1100 },
  { month: 'May', accidents: 1400, resolved: 1350 },
  { month: 'Jun', accidents: 1250, resolved: 1200 },
]

const responseTimeData = [
  { time: '0-5min', count: 45 },
  { time: '5-10min', count: 30 },
  { time: '10-15min', count: 15 },
  { time: '15-20min', count: 7 },
  { time: '20+min', count: 3 },
]

const severityData = [
  { name: 'Low', value: 35, color: '#22C55E' },
  { name: 'Medium', value: 40, color: '#F59E0B' },
  { name: 'High', value: 20, color: '#DC2626' },
  { name: 'Critical', value: 5, color: '#7C3AED' },
]

export default function Dashboard() {
  const { t } = useLanguage()
  const { speak } = useAccessibility()
  const [activeTab, setActiveTab] = useState<'analytics' | 'user' | 'admin'>('analytics')
  const [user, setUser] = useState<{ name: string; email: string; phone: string; role: string } | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user')
      if (stored) {
        setUser(JSON.parse(stored))
      }
    }
  }, [])

  // User profile inputs
  const [contacts, setContacts] = useState([
    { name: 'Rajesh Kumar (Father)', phone: '+91 98765 43210' },
    { name: 'Suman Devi (Mother)', phone: '+91 87654 32109' }
  ])
  const [newContactName, setNewContactName] = useState('')
  const [newContactPhone, setNewContactPhone] = useState('')

  const [medicalProfile, setMedicalProfile] = useState({
    bloodGroup: 'O+ Positive',
    allergies: 'Penicillin',
    conditions: 'None',
  })

  // Drone simulation telemetry state
  const [droneFlying, setDroneFlying] = useState(false)
  const [droneAltitude, setDroneAltitude] = useState(0)
  const [droneBattery, setDroneBattery] = useState(100)
  const [droneLat, setDroneLat] = useState(12.9716)
  const [droneLng, setDroneLng] = useState(77.5946)
  const droneTimer = useRef<NodeJS.Timeout | null>(null)

  // Incident queue state
  const [incidents, setIncidents] = useState([
    { id: '101', location: 'NH-48 Corridor, Chennai', type: 'Accident', severity: 'High', time: '2 mins ago', status: 'Responding' },
    { id: '102', location: 'OMR Road intersection', type: 'Accident', severity: 'Critical', time: '12 mins ago', status: 'Pending Approval' },
    { id: '103', location: 'GST Road Highway', type: 'Medical Distress', severity: 'Low', time: '40 mins ago', status: 'Resolved' },
  ])

  // Drone path simulation ticker
  useEffect(() => {
    if (droneFlying) {
      speak('Dispatching aerial surveillance drone to NH-48 coordinates. Launching autopilot path.')
      let progress = 0
      droneTimer.current = setInterval(() => {
        progress += 0.05
        setDroneAltitude(Math.min(120, Math.floor(progress * 240)))
        setDroneBattery((prev) => Math.max(10, prev - 1))
        
        // Slightly fluctuate GPS coordinates to show live drift
        setDroneLat(12.9716 + Math.sin(progress * 4) * 0.003)
        setDroneLng(77.5946 + Math.cos(progress * 4) * 0.003)

        if (progress >= 1) {
          setDroneFlying(false)
          speak('Surveillance drone arrived at crash scene. Transmitting high-definition video feed and thermal coordinates.')
          if (droneTimer.current) clearInterval(droneTimer.current)
        }
      }, 500)
    } else {
      if (droneTimer.current) clearInterval(droneTimer.current)
    }

    return () => {
      if (droneTimer.current) clearInterval(droneTimer.current)
    }
  }, [droneFlying])

  const handleAddContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) return
    setContacts([...contacts, { name: newContactName, phone: newContactPhone }])
    setNewContactName('')
    setNewContactPhone('')
    speak('Emergency contact added successfully.')
  }

  const handleDeleteContact = (index: number) => {
    setContacts(contacts.filter((_, idx) => idx !== index))
    speak('Emergency contact removed.')
  }

  const toggleTab = (tab: 'analytics' | 'user' | 'admin') => {
    setActiveTab(tab)
    speak(`${tab} panel loaded`)
  }

  return (
    <section id="dashboard" className="py-24 bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-slate-900 via-blue-600 to-cyan-500 dark:from-white dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Control Dashboard
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Manage your digital profile, examine rescue analytics, or coordinates drone twin simulations.
          </p>
        </div>

        {/* Panel Switcher Tabs */}
        <div className="flex justify-center gap-2 mb-12 max-w-md mx-auto bg-slate-100 dark:bg-slate-850 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800">
          <button
            onClick={() => toggleTab('analytics')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Analytics Hub
          </button>
          <button
            onClick={() => toggleTab('user')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'user'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            User Panel
          </button>
          <button
            onClick={() => toggleTab('admin')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'admin'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Admin Control
          </button>
        </div>

        {/* Tab Contents */}
        <AnimatePresence mode="wait">
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Accident Trends */}
              <Card className="shadow-xl border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-xl">Incidents vs. Resolution Trends</CardTitle>
                  <CardDescription>Emergency resolves during Golden Hour (Monthly)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={accidentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="accidents" fill="#2563EB" name="Total Accidents" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="resolved" fill="#22C55E" name="Golden Hour Resolves" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Response Time */}
              <Card className="shadow-xl border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-xl">Response Time Distribution</CardTitle>
                  <CardDescription>Time delta between SOS trigger and paramedic arrival</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={responseTimeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#06B6D4" strokeWidth={4} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Severity Distribution */}
              <Card className="shadow-xl border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-xl">Accident Severity Ratios</CardTitle>
                  <CardDescription>Calculated through visual YOLO image analytics</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="w-full max-w-[200px]">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={severityData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {severityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2.5 w-full">
                    {severityData.map((entry) => (
                      <div key={entry.name} className="flex items-center justify-between text-sm border-b border-slate-100 dark:border-slate-800 pb-1.5">
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                          {entry.name}
                        </span>
                        <span className="font-bold">{entry.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Real-time statistics summaries */}
              <Card className="shadow-xl border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl h-full">
                <CardHeader>
                  <CardTitle className="text-xl">Live Triage Status</CardTitle>
                  <CardDescription>Active telemetry across national safety grids</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: 'Active SOS Alerts', value: '23', color: 'text-red-500 bg-red-50 dark:bg-red-500/10' },
                    { label: 'Ambulances in Transit', value: '15', color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
                    { label: 'Level-1 Emergency Bed Occupancy', value: '88%', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' },
                    { label: 'Average Dispatch Lag Time', value: '52s', color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-500/10' },
                  ].map((stat, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                      <span className="text-slate-700 dark:text-slate-300 font-semibold text-xs">{stat.label}</span>
                      <span className={`text-base font-extrabold px-3 py-1 rounded-xl ${stat.color}`}>{stat.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'user' && (
            <motion.div
              key="user"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="w-full"
            >
              {user ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Medical Triage Profile */}
                  <Card className="lg:col-span-1 shadow-xl border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        <HeartPulse className="w-5 h-5 text-red-500" />
                        Medical Profile
                      </CardTitle>
                      <CardDescription>Synchronized automatically with dispatched ambulances</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-xs text-slate-500 font-bold block mb-1">Blood Group</label>
                        <input 
                          type="text" 
                          value={medicalProfile.bloodGroup} 
                          onChange={(e) => setMedicalProfile({ ...medicalProfile, bloodGroup: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-sm text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 font-bold block mb-1">Allergies (Comma separated)</label>
                        <input 
                          type="text" 
                          value={medicalProfile.allergies} 
                          onChange={(e) => setMedicalProfile({ ...medicalProfile, allergies: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-sm text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 font-bold block mb-1">Chronic Health Conditions</label>
                        <input 
                          type="text" 
                          value={medicalProfile.conditions} 
                          onChange={(e) => setMedicalProfile({ ...medicalProfile, conditions: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-sm text-slate-900 dark:text-white"
                        />
                      </div>
                      <Button onClick={() => speak('Medical profile details saved successfully.')} className="w-full text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white">
                        Save Profile
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Emergency Contacts */}
                  <Card className="lg:col-span-2 shadow-xl border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        <Users className="w-5 h-5 text-blue-600" />
                        Emergency Contacts
                      </CardTitle>
                      <CardDescription>Notified automatically via Twilio SMS gateways during SOS triggers</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Contacts List */}
                      <div className="space-y-2">
                        {contacts.map((contact, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800 rounded-xl">
                            <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">{contact.name}</p>
                              <p className="text-xs text-slate-500 font-mono mt-0.5">{contact.phone}</p>
                            </div>
                            <button 
                              onClick={() => handleDeleteContact(idx)}
                              className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-55 dark:hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add Contacts Form */}
                      <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
                        <span className="text-xs font-bold text-slate-500 block">Add Contact Node</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input 
                            type="text" 
                            placeholder="Name (e.g. Spouse)" 
                            value={newContactName}
                            onChange={(e) => setNewContactName(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-sm text-slate-900 dark:text-white"
                          />
                          <input 
                            type="text" 
                            placeholder="Phone (e.g. +91 9898...)" 
                            value={newContactPhone}
                            onChange={(e) => setNewContactPhone(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-sm font-mono text-slate-900 dark:text-white"
                          />
                        </div>
                        <Button onClick={handleAddContact} variant="outline" className="w-full flex items-center justify-center gap-1.5 text-xs font-bold">
                          <Plus className="w-4 h-4" />
                          Bind Emergency Contact
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="p-8 text-center space-y-4 max-w-2xl mx-auto border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                  <HeartPulse className="w-12 h-12 text-red-500 mx-auto animate-pulse" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Secure Citizen Access Required</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">
                    Please authenticate your profile to manage emergency health profiles, blood groups, and verified contacts for emergency dispatch.
                  </p>
                  <p className="text-xs text-amber-500 font-semibold">
                    Use the 'Log In' button in the navigation bar to sign in.
                  </p>
                </Card>
              )}
            </motion.div>
          )}

          {activeTab === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="w-full"
            >
              {user && (user.role?.toLowerCase() === 'dispatcher' || user.role?.toLowerCase() === 'admin') ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Drone simulation controls & telemetry */}
                  <Card className="lg:col-span-8 shadow-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white rounded-3xl p-6 flex flex-col justify-between min-h-[400px]">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                          <span className="text-[9px] uppercase font-bold tracking-widest text-cyan-400 block leading-none">Digital Twin simulation</span>
                          <h3 className="text-xl font-extrabold text-white mt-1 flex items-center gap-2">
                            <Plane className="w-5.5 h-5.5 text-cyan-400" />
                            Aerial Scan Drone dispatcher
                          </h3>
                        </div>
                        <Button 
                          variant="sos" 
                          size="sm" 
                          onClick={() => setDroneFlying(true)} 
                          disabled={droneFlying}
                        >
                          Launch Patrol Drone
                        </Button>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed mt-4">
                        Launches a digital twin telemetry simulation. Autopilot drone streams camera frames and altitude logs directly to hospitals, providing visual diagnostics of crash locations.
                      </p>

                      {/* Telemetry statistics visual */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                        <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl">
                          <span className="text-[10px] text-slate-500 font-bold block">ALTITUDE</span>
                          <span className="text-lg font-mono font-bold text-white mt-1 block">
                            {droneAltitude} M
                          </span>
                        </div>
                        <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl">
                          <span className="text-[10px] text-slate-500 font-bold block">BATTERY CELL</span>
                          <span className="text-lg font-mono font-bold text-white mt-1 block flex items-center gap-1.5">
                            <span className={`w-2.5 h-2.5 rounded-full ${droneBattery > 30 ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
                            {droneBattery}%
                          </span>
                        </div>
                        <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl">
                          <span className="text-[10px] text-slate-500 font-bold block">LATITUDE</span>
                          <span className="text-xs font-mono font-bold text-cyan-400 mt-1 block">
                            {droneLat.toFixed(5)}
                          </span>
                        </div>
                        <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl">
                          <span className="text-[10px] text-slate-500 font-bold block">LONGITUDE</span>
                          <span className="text-xs font-mono font-bold text-cyan-400 mt-1 block">
                            {droneLng.toFixed(5)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Drone Status bar */}
                    <div className="mt-8 bg-slate-950 border border-slate-850 p-4 rounded-2xl flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${droneFlying ? 'bg-cyan-500 animate-ping' : 'bg-slate-600'}`} />
                        Status: {droneFlying ? 'Surveillance Autopilot Active' : 'Docked in Emergency Hub'}
                      </span>
                      {droneFlying && (
                        <span className="text-[10px] font-bold text-cyan-400 font-mono animate-pulse">STREAMING LIVE telemetry...</span>
                      )}
                    </div>

                  </Card>

                  {/* Admin Incidents Queue log */}
                  <Card className="lg:col-span-4 shadow-xl border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl h-full flex flex-col justify-between">
                    <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-850">
                      <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        <ShieldAlert className="w-5 h-5 text-red-500" />
                        Incoming dispatch feeds
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="pt-4 space-y-3 flex-1 overflow-y-auto max-h-[300px]">
                      {incidents.map((inc) => (
                        <div key={inc.id} className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-150 dark:border-slate-850 space-y-1.5 text-xs text-left">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-slate-900 dark:text-white">Incident ID #{inc.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              inc.severity === 'Critical' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-slate-900'
                            }`}>
                              {inc.severity}
                            </span>
                          </div>
                          
                          <div className="text-slate-500 dark:text-slate-400">
                            Location: <strong className="text-slate-800 dark:text-slate-200">{inc.location}</strong>
                          </div>

                          <div className="flex items-center justify-between text-[10px] pt-1">
                            <span className="text-slate-400">{inc.time}</span>
                            <span className="text-blue-600 dark:text-cyan-400 font-semibold">{inc.status}</span>
                          </div>
                        </div>
                      ))}
                    </CardContent>

                  </Card>
                </div>
              ) : (
                <Card className="p-8 text-center space-y-4 max-w-2xl mx-auto border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                  <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Administrative / Dispatcher Credentials Required</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">
                    Access to digital twin drone telemetry, active incident management, and automated traffic dispatch grids is restricted to authorized rescue dispatchers.
                  </p>
                  {user ? (
                    <p className="text-xs text-amber-500 font-semibold">
                      Your current session role is: <span className="uppercase font-mono font-extrabold">{user.role}</span>. Standard Citizen accounts lack dispatcher privileges.
                    </p>
                  ) : (
                    <p className="text-xs text-slate-450">
                      Please log in as an administrator or dispatcher using the navigation bar button to view this dashboard.
                    </p>
                  )}
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}
