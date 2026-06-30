export interface User {
  id: string
  name: string
  email: string
  phone: string
  emergencyContacts: EmergencyContact[]
  medicalProfile: MedicalProfile
  vehicleDetails: VehicleDetails
}

export interface EmergencyContact {
  id: string
  name: string
  phone: string
  relation: string
}

export interface MedicalProfile {
  bloodGroup: string
  allergies: string[]
  conditions: string[]
  medications: string[]
}

export interface VehicleDetails {
  type: string
  model: string
  licensePlate: string
  insurance: string
}

export interface SOSRequest {
  id: string
  userId: string
  location: Location
  timestamp: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'responding' | 'resolved'
  type: 'accident' | 'medical' | 'fire' | 'police'
}

export interface Location {
  lat: number
  lng: number
  address: string
}

export interface Hospital {
  id: string
  name: string
  location: Location
  phone: string
  type: 'trauma' | 'general' | 'specialized'
  bedsAvailable: number
  distance: number
}

export interface Ambulance {
  id: string
  location: Location
  status: 'available' | 'busy' | 'maintenance'
  eta: number
}

export interface AccidentReport {
  id: string
  userId: string
  location: Location
  timestamp: number
  description: string
  images: string[]
  severityScore: number
  aiAnalysis: AIAnalysis
  status: 'submitted' | 'reviewing' | 'resolved'
}

export interface AIAnalysis {
  vehicleDamage: string
  roadDamage: string
  detectedHazards: string[]
  severityScore: number
  recommendations: string[]
}
