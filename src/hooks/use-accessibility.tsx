'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type ColorBlindMode = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochrome'

interface AccessibilityContextType {
  highContrast: boolean
  setHighContrast: (val: boolean) => void
  largeText: boolean
  setLargeText: (val: boolean) => void
  colorBlindMode: ColorBlindMode
  setColorBlindMode: (mode: ColorBlindMode) => void
  screenReaderActive: boolean
  setScreenReaderActive: (val: boolean) => void
  speak: (text: string) => void
  stopSpeaking: () => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [highContrast, setHighContrast] = useState(false)
  const [largeText, setLargeText] = useState(false)
  const [colorBlindMode, setColorBlindMode] = useState<ColorBlindMode>('normal')
  const [screenReaderActive, setScreenReaderActive] = useState(false)

  const speak = (text: string) => {
    if (!screenReaderActive || typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.0
    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }

  // Handle color blind mode body filters
  useEffect(() => {
    if (typeof document === 'undefined') return
    const body = document.body
    body.classList.remove('filter-protanopia', 'filter-deuteranopia', 'filter-tritanopia', 'filter-grayscale')
    
    if (colorBlindMode === 'protanopia') body.classList.add('filter-protanopia')
    else if (colorBlindMode === 'deuteranopia') body.classList.add('filter-deuteranopia')
    else if (colorBlindMode === 'tritanopia') body.classList.add('filter-tritanopia')
    else if (colorBlindMode === 'monochrome') body.classList.add('filter-grayscale')
  }, [colorBlindMode])

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        setHighContrast,
        largeText,
        setLargeText,
        colorBlindMode,
        setColorBlindMode,
        screenReaderActive,
        setScreenReaderActive,
        speak,
        stopSpeaking,
      }}
    >
      <div className={`${highContrast ? 'high-contrast' : ''} ${largeText ? 'text-lg-accessibility' : ''}`}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}
