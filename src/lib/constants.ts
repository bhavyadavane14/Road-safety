export const COLORS = {
  primary: '#0F172A',
  secondary: '#2563EB',
  accent: '#06B6D4',
  success: '#22C55E',
  danger: '#DC2626',
  warning: '#F59E0B',
  background: '#F8FAFC',
  darkBackground: '#020617',
  card: 'rgba(255,255,255,0.75)',
} as const

export const EMERGENCY_NUMBERS = {
  police: '100',
  ambulance: '102',
  fire: '101',
  women: '1091',
} as const

export const FEATURES = [
  { icon: '🤖', title: 'AI Emergency Assistant', desc: '24/7 AI-powered emergency guidance' },
  { icon: '🎤', title: 'Voice Assistant', desc: 'Hands-free emergency communication' },
  { icon: '🚨', title: 'Accident Detection', desc: 'Automatic crash detection & alert' },
  { icon: '🏥', title: 'Nearest Hospital Finder', desc: 'Quick locate trauma centers' },
  { icon: '🚑', title: 'Nearest Ambulance', desc: 'Real-time ambulance tracking' },
  { icon: '👮', title: 'Police Locator', desc: 'Find nearest police station' },
  { icon: '📞', title: 'Emergency Contacts', desc: 'One-tap emergency calls' },
  { icon: '🆘', title: 'One Tap SOS', desc: 'Instant emergency activation' },
  { icon: '📴', title: 'Offline Emergency Mode', desc: 'Works without internet' },
  { icon: '📚', title: 'Road Safety Education', desc: 'Learn safety protocols' },
  { icon: '💬', title: 'AI Chatbot', desc: 'Intelligent emergency Q&A' },
  { icon: '⏱️', title: 'Golden Hour Guidance', desc: 'Critical first hour assistance' },
  { icon: '🩹', title: 'First Aid Assistant', desc: 'Step-by-step medical guidance' },
  { icon: '📍', title: 'Live GPS Tracking', desc: 'Real-time location sharing' },
  { icon: '🚦', title: 'Traffic Awareness', desc: 'Live traffic updates' },
  { icon: '⚠️', title: 'Road Hazard Alerts', desc: 'Danger zone notifications' },
  { icon: '🩸', title: 'Blood Bank Finder', desc: 'Locate blood banks nearby' },
  { icon: '🚗', title: 'Vehicle Recovery', desc: 'Towing & recovery assistance' },
  { icon: '🌐', title: 'Multilingual Support', desc: '12+ Indian languages' },
  { icon: '♿', title: 'Accessibility Features', desc: 'Inclusive design for all' },
] as const

export const STATS = [
  { value: '120,000+', label: 'Lives Saved' },
  { value: '18,000+', label: 'Hospitals Connected' },
  { value: '30,000+', label: 'Ambulances' },
  { value: '15,000+', label: 'Police Stations' },
  { value: '7 Minutes', label: 'Avg Response Time' },
  { value: '100+', label: 'Countries Supported' },
] as const

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'mr', name: 'मराठी' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ' },
  { code: 'ml', name: 'മലയാളം' },
] as const
