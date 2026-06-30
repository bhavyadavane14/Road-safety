'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, CheckCircle2, XCircle, ArrowRight, RotateCcw, ShieldCheck, Download, Trophy, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useAccessibility } from '@/hooks/use-accessibility'

interface QuizQuestion {
  question: string
  options: string[]
  answerIdx: number
  explanation: string
}

export default function SafetyQuiz() {
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)

  const { speak } = useAccessibility()

  const questions: QuizQuestion[] = [
    {
      question: "What is the primary duration range defined as the Golden Hour in road emergencies?",
      options: [
        "First 30 minutes after collision",
        "First 60 minutes after collision",
        "First 2 hours after collision",
        "The time it takes for emergency services to arrive"
      ],
      answerIdx: 1,
      explanation: "The Golden Hour refers to the first 60 minutes after a traumatic injury. Prompt medical intervention during this period offers the highest likelihood of preventing death."
    },
    {
      question: "Which of the following is correct when executing chest compressions during adult CPR?",
      options: [
        "Compress 10-20 times per minute, 1 inch deep",
        "Compress 100-120 times per minute, at least 2 inches deep",
        "Compress only when the patient shows signs of waking up",
        "Deliver breaths every 2 seconds without compressions"
      ],
      answerIdx: 1,
      explanation: "Standard CPR requires push compressions in the center of the chest at 100 to 120 beats per minute, pushing down at least 2 inches deep."
    },
    {
      question: "In India, what is the legal speed limit for passenger cars on national expressways?",
      options: [
        "80 km/h",
        "100 km/h",
        "120 km/h",
        "140 km/h"
      ],
      answerIdx: 2,
      explanation: "The maximum speed limit for cars on national expressways in India is capped at 120 km/h under Ministry guidelines."
    },
    {
      question: "What does a round blue sign with a white arrow pointing diagonally down-right represent?",
      options: [
        "One-way traffic ahead",
        "Keep Left mandate",
        "Keep Right mandate",
        "No overtaking allowed"
      ],
      answerIdx: 2,
      explanation: "A circular blue sign with a diagonal arrow pointing down-right dictates 'Keep Right' for incoming road flows."
    },
    {
      question: "What is the primary role of a Good Samaritan under Indian Road Protection laws?",
      options: [
        "To pays the hospital bills for crash victims",
        "To provide emergency helper actions without fear of legal or police harassment",
        "To record crash scenes for social media broadcasts",
        "To legally represent the victim in dispute courts"
      ],
      answerIdx: 1,
      explanation: "The Good Samaritan Law protects bystanders who feed, help, or transport accident victims to hospitals from legal, police, or court harassment."
    }
  ]

  const handleStart = () => {
    setQuizStarted(true)
    setCurrentIdx(0)
    setSelectedOpt(null)
    setIsAnswered(false)
    setScore(0)
    setQuizCompleted(false)
    setShowCertificate(false)
    speak("Road safety quiz started. Read question number one.")
  }

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return
    setSelectedOpt(idx)
  }

  const handleSubmit = () => {
    if (selectedOpt === null || isAnswered) return
    setIsAnswered(true)
    
    const correct = selectedOpt === questions[currentIdx].answerIdx
    if (correct) {
      setScore(s => s + 1)
      speak("Correct answer. Good job.")
    } else {
      speak(`Incorrect. The correct option is: ${questions[currentIdx].options[questions[currentIdx].answerIdx]}`)
    }
  }

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(c => c + 1)
      setSelectedOpt(null)
      setIsAnswered(false)
      speak(`Question number ${currentIdx + 2}`)
    } else {
      setQuizCompleted(true)
      const finalPercentage = (score / questions.length) * 100
      speak(`Quiz completed. Your final score is ${score} out of ${questions.length}.`)
      // Trigger notification updates in User Profile context if necessary
    }
  }

  const printCertificate = () => {
    speak('Preparing certificate file print.')
    window.print()
  }

  return (
    <section id="safety-quiz" className="py-24 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-slate-900 via-blue-600 to-cyan-500 dark:from-white dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Road Safety Gamification
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Learn safety procedures, unlock achievements and earn your Good Samaritan Safety Certificate.
          </p>
        </div>

        {/* Dashboard Quiz interface */}
        <div className="max-w-3xl mx-auto">
          {!quizStarted ? (
            <Card className="border border-slate-200 dark:border-slate-800 shadow-2xl p-8 text-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl space-y-6">
              <Trophy className="w-20 h-20 text-yellow-500 mx-auto animate-bounce" />
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Safety Knowledge Challenge</h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
                Unlock the <strong>Safety Master Badge</strong> by completing our 5-question safety test with a score of 100%. Earn an official digital twin certificate under Digital India standards.
              </p>
              
              {/* Badges display */}
              <div className="flex justify-center gap-6 py-4">
                <div className="flex flex-col items-center opacity-70">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/30 text-yellow-500">
                    <Star className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold mt-1">Quiz Master</span>
                </div>
                <div className="flex flex-col items-center opacity-70">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/30 text-blue-500">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold mt-1">Good Samaritan</span>
                </div>
                <div className="flex flex-col items-center opacity-70">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/30 text-green-500">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold mt-1">Safe Driver</span>
                </div>
              </div>

              <Button onClick={handleStart} size="lg" className="px-8 font-bold">
                Start Challenge
              </Button>
            </Card>
          ) : !quizCompleted ? (
            <Card className="border border-slate-200 dark:border-slate-800 shadow-2xl p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl">
              
              {/* Progress HUD */}
              <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-bold mb-6">
                <span>QUESTION {currentIdx + 1} OF {questions.length}</span>
                <span className="font-mono bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-lg">
                  Score: {score}/{questions.length}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full mb-8 overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <h3 className="text-xl font-extrabold text-slate-950 dark:text-white mb-8">
                {questions[currentIdx].question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {questions[currentIdx].options.map((opt, oIdx) => {
                  const isSelected = selectedOpt === oIdx
                  const isCorrect = oIdx === questions[currentIdx].answerIdx
                  
                  let optionClass = 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                  if (isSelected) {
                    optionClass = 'border-blue-500 bg-blue-500/5 text-blue-600 dark:text-blue-400'
                  }
                  if (isAnswered) {
                    if (isCorrect) {
                      optionClass = 'border-green-500 bg-green-500/10 text-green-600 dark:text-green-400'
                    } else if (isSelected) {
                      optionClass = 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400'
                    } else {
                      optionClass = 'opacity-40 border-slate-200 dark:border-slate-800'
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={isAnswered}
                      onClick={() => handleOptionSelect(oIdx)}
                      className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-between ${optionClass}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />}
                      {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                    </button>
                  )
                })}
              </div>

              {/* Explanation section */}
              {isAnswered && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
                >
                  <strong className="text-slate-900 dark:text-white font-bold block mb-1">EXPLANATION:</strong>
                  {questions[currentIdx].explanation}
                </motion.div>
              )}

              {/* Action buttons */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-850 flex justify-end">
                {!isAnswered ? (
                  <Button 
                    disabled={selectedOpt === null}
                    onClick={handleSubmit} 
                    className="font-bold flex items-center gap-1.5"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="font-bold flex items-center gap-1.5">
                    {currentIdx < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>

            </Card>
          ) : (
            /* Quiz Completed screen */
            <Card className="border border-slate-200 dark:border-slate-800 shadow-2xl p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl text-center space-y-6">
              <Award className="w-20 h-20 text-emerald-500 mx-auto animate-pulse" />
              
              <div className="space-y-2">
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">Challenge Completed!</h3>
                <p className="text-lg text-slate-500 dark:text-slate-400">
                  You scored <span className="font-bold text-emerald-500">{score}</span> out of <span className="font-bold">{questions.length}</span>.
                </p>
              </div>

              {score === questions.length ? (
                <div className="bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 max-w-md mx-auto space-y-4">
                  <p className="text-sm text-emerald-700 dark:text-emerald-400 font-semibold leading-relaxed">
                    🌟 Congratulations! You have unlocked the **Good Samaritan Master Certificate** and safety score bonus points.
                  </p>
                  <Button onClick={() => setShowCertificate(true)} className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700">
                    <Download className="w-4.5 h-4.5" />
                    Claim Certificate
                  </Button>
                </div>
              ) : (
                <div className="bg-red-500/10 dark:bg-red-500/5 border border-red-500/20 rounded-2xl p-5 max-w-md mx-auto">
                  <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                    Try again to score 100% and unlock your Good Samaritan Safety Certificate.
                  </p>
                </div>
              )}

              <div className="flex gap-4 justify-center pt-4">
                <Button variant="outline" onClick={handleStart} className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Retake Quiz
                </Button>
                <Button variant="default" onClick={() => setQuizStarted(false)}>
                  Close Portal
                </Button>
              </div>

            </Card>
          )}
        </div>

        {/* Certificate Printable Modal overlay */}
        <AnimatePresence>
          {showCertificate && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6 print:p-0 print:bg-white overflow-y-auto"
            >
              <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white text-slate-900 border-[16px] border-double border-blue-900 max-w-3xl w-full p-12 shadow-2xl relative print:border-none print:shadow-none print:max-w-full font-serif"
              >
                {/* Government crest simulation header */}
                <div className="text-center space-y-2 mb-6">
                  <div className="w-10 h-10 rounded-full bg-blue-900 mx-auto flex items-center justify-center text-white font-bold text-xs">
                    SOS
                  </div>
                  <h4 className="text-xs uppercase font-sans tracking-widest font-extrabold text-blue-900">
                    GOVERNMENT OF INDIA • HACKATHON INITIATIVE
                  </h4>
                  <h5 className="text-[10px] uppercase font-sans text-slate-500 tracking-wider">
                    NATIONAL ROAD SAFETY DEFENSE DIVISION
                  </h5>
                </div>

                {/* Main Body */}
                <div className="text-center space-y-6">
                  <h2 className="text-4xl font-semibold text-blue-900 italic font-serif">Certificate of Safety Merit</h2>
                  <p className="text-xs font-sans text-slate-500 uppercase tracking-widest">THIS CERTIFICATE IS GRANTED TO THE CITIZEN BY THE BOARD FOR SUCCESSFULLY COMPLETING THE</p>
                  
                  <h3 className="text-2xl font-bold uppercase text-slate-900 font-sans tracking-wide">RoadSOS Good Samaritan Certification</h3>
                  
                  <p className="text-sm leading-relaxed max-w-lg mx-auto font-sans text-slate-600">
                    Having demonstrated complete mastery over first-aid triage protocols, Golden Hour guidelines, cardiopulmonary resuscitation compression rates, and expressway road regulations.
                  </p>

                  {/* Cert signatures */}
                  <div className="grid grid-cols-2 gap-12 pt-10 border-t border-slate-200 mt-12 font-sans text-left text-xs text-slate-500">
                    <div>
                      <p className="border-b border-slate-300 pb-1.5 font-bold text-slate-800">MoRTH Directorate</p>
                      <p className="mt-1">Ministry of Road Transport & Highways</p>
                    </div>
                    <div className="text-right">
                      <p className="border-b border-slate-300 pb-1.5 font-bold text-slate-800">IIT Madras Hackathon</p>
                      <p className="mt-1">Technical Road Safety Evaluation Unit</p>
                    </div>
                  </div>
                </div>

                {/* Print Control floating UI */}
                <div className="absolute top-4 right-4 flex gap-2 print:hidden font-sans">
                  <Button size="sm" onClick={printCertificate} className="flex items-center gap-1.5 bg-blue-900">
                    <Download className="w-4 h-4" />
                    Print / PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowCertificate(false)}>
                    Close
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}
