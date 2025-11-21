'use client'

import { useState, useEffect } from 'react'
import MemberLayout from '@/components/MemberLayout'

export default function ReadingPlanPage() {
  const [selectedPlan, setSelectedPlan] = useState('yearly')
  const [progress, setProgress] = useState({})
  const [currentDate, setCurrentDate] = useState(new Date())
  const [streak, setStreak] = useState(0)

  const readingPlans = {
    yearly: {
      name: 'Read Bible in a Year',
      description: 'Complete the entire Bible in 365 days',
      duration: 365,
      icon: 'fa-calendar-alt',
      color: 'purple',
      schedule: [
        { day: 1, reading: 'Genesis 1-3', testament: 'old' },
        { day: 2, reading: 'Genesis 4-7', testament: 'old' },
        { day: 3, reading: 'Genesis 8-11', testament: 'old' },
        { day: 4, reading: 'Genesis 12-15', testament: 'old' },
        { day: 5, reading: 'Genesis 16-18', testament: 'old' },
        { day: 6, reading: 'Genesis 19-22', testament: 'old' },
        { day: 7, reading: 'Matthew 1-4', testament: 'new' }
      ]
    },
    psalms: {
      name: 'Psalms & Proverbs',
      description: 'Read through Psalms and Proverbs in 60 days',
      duration: 60,
      icon: 'fa-music',
      color: 'teal',
      schedule: [
        { day: 1, reading: 'Psalm 1-5', testament: 'old' },
        { day: 2, reading: 'Psalm 6-10', testament: 'old' },
        { day: 3, reading: 'Psalm 11-15', testament: 'old' },
        { day: 4, reading: 'Psalm 16-20', testament: 'old' },
        { day: 5, reading: 'Proverbs 1-3', testament: 'old' },
        { day: 6, reading: 'Proverbs 4-6', testament: 'old' },
        { day: 7, reading: 'Proverbs 7-9', testament: 'old' }
      ]
    },
    gospels: {
      name: 'Four Gospels',
      description: 'Journey through Matthew, Mark, Luke, and John',
      duration: 30,
      icon: 'fa-cross',
      color: 'amber',
      schedule: [
        { day: 1, reading: 'Matthew 1-4', testament: 'new' },
        { day: 2, reading: 'Matthew 5-7', testament: 'new' },
        { day: 3, reading: 'Matthew 8-10', testament: 'new' },
        { day: 4, reading: 'Matthew 11-13', testament: 'new' },
        { day: 5, reading: 'Matthew 14-16', testament: 'new' },
        { day: 6, reading: 'Matthew 17-19', testament: 'new' },
        { day: 7, reading: 'Matthew 20-22', testament: 'new' }
      ]
    },
    newTestament: {
      name: 'New Testament',
      description: 'Read the entire New Testament in 90 days',
      duration: 90,
      icon: 'fa-dove',
      color: 'emerald',
      schedule: [
        { day: 1, reading: 'Matthew 1-4', testament: 'new' },
        { day: 2, reading: 'Matthew 5-7', testament: 'new' },
        { day: 3, reading: 'Matthew 8-10', testament: 'new' },
        { day: 4, reading: 'Matthew 11-13', testament: 'new' },
        { day: 5, reading: 'Matthew 14-16', testament: 'new' },
        { day: 6, reading: 'Matthew 17-19', testament: 'new' },
        { day: 7, reading: 'Matthew 20-22', testament: 'new' }
      ]
    }
  }

  useEffect(() => {
    loadProgress()
    calculateStreak()
  }, [selectedPlan])

  const loadProgress = () => {
    const savedProgress = JSON.parse(localStorage.getItem(`reading-plan-${selectedPlan}`) || '{}')
    setProgress(savedProgress)
  }

  const saveProgress = (newProgress) => {
    localStorage.setItem(`reading-plan-${selectedPlan}`, JSON.stringify(newProgress))
    setProgress(newProgress)
    calculateStreak()
  }

  const markAsRead = (day) => {
    const today = new Date().toDateString()
    const newProgress = {
      ...progress,
      [day]: {
        completed: true,
        date: today,
        timestamp: new Date().toISOString()
      }
    }
    saveProgress(newProgress)
  }

  const markAsUnread = (day) => {
    const newProgress = { ...progress }
    delete newProgress[day]
    saveProgress(newProgress)
  }

  const calculateStreak = () => {
    const plan = readingPlans[selectedPlan]
    let currentStreak = 0
    const today = new Date()
    
    for (let i = 1; i <= plan.duration; i++) {
      if (progress[i]?.completed) {
        const readDate = new Date(progress[i].date)
        const daysDiff = Math.floor((today - readDate) / (1000 * 60 * 60 * 24))
        
        if (daysDiff <= i) {
          currentStreak++
        } else {
          break
        }
      } else {
        break
      }
    }
    
    setStreak(currentStreak)
  }

  const getProgressPercentage = () => {
    const plan = readingPlans[selectedPlan]
    const completedDays = Object.keys(progress).filter(day => progress[day]?.completed).length
    return Math.round((completedDays / plan.duration) * 100)
  }

  const getCurrentWeek = () => {
    const plan = readingPlans[selectedPlan]
    const startDay = Math.max(1, Math.floor(Object.keys(progress).length / 7) * 7 + 1)
    const endDay = Math.min(plan.duration, startDay + 6)
    
    return plan.schedule.slice(startDay - 1, endDay).map((item, index) => ({
      ...item,
      day: startDay + index
    }))
  }

  const plan = readingPlans[selectedPlan]
  const progressPercentage = getProgressPercentage()
  const completedDays = Object.keys(progress).filter(day => progress[day]?.completed).length

  return (
    <MemberLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <i className="fas fa-calendar-check text-3xl text-emerald-600 dark:text-emerald-400 mr-3"></i>
            <h1 className="text-3xl font-heading font-bold text-black dark:text-white">Reading Plan</h1>
          </div>
          <p className="text-gray-600 dark:text-neutral-400">Stay consistent in God's Word with structured reading plans</p>
        </div>

        {/* Plan Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Object.entries(readingPlans).map(([key, planInfo]) => (
            <button
              key={key}
              onClick={() => setSelectedPlan(key)}
              className={`p-6 rounded-2xl border-2 transition-all text-left ${
                selectedPlan === key
                  ? `border-${planInfo.color}-500 bg-${planInfo.color}-50 dark:bg-${planInfo.color}-950/20`
                  : 'border-gray-200 dark:border-neutral-900 bg-white dark:bg-neutral-950 hover:border-gray-300 dark:hover:border-neutral-800'
              }`}
            >
              <div className={`w-12 h-12 bg-${planInfo.color}-100 dark:bg-${planInfo.color}-950 rounded-lg flex items-center justify-center mb-4`}>
                <i className={`fas ${planInfo.icon} text-xl text-${planInfo.color}-600 dark:text-${planInfo.color}-400`}></i>
              </div>
              <h3 className="font-heading font-bold text-black dark:text-white mb-2">{planInfo.name}</h3>
              <p className="text-sm text-gray-600 dark:text-neutral-400 mb-2">{planInfo.description}</p>
              <p className="text-xs text-gray-500 dark:text-neutral-500">{planInfo.duration} days</p>
            </button>
          ))}
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-md border border-gray-100 dark:border-neutral-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Progress</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{progressPercentage}%</p>
              </div>
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 rounded-xl flex items-center justify-center">
                <i className="fas fa-chart-line text-2xl text-emerald-600 dark:text-emerald-400"></i>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-md border border-gray-100 dark:border-neutral-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Days Completed</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{completedDays}</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-950 rounded-xl flex items-center justify-center">
                <i className="fas fa-check-circle text-2xl text-blue-600 dark:text-blue-400"></i>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-md border border-gray-100 dark:border-neutral-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Current Streak</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{streak}</p>
              </div>
              <div className="w-14 h-14 bg-amber-100 dark:bg-amber-950 rounded-xl flex items-center justify-center">
                <i className="fas fa-fire text-2xl text-amber-600 dark:text-amber-400"></i>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-md border border-gray-100 dark:border-neutral-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Days Remaining</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{plan.duration - completedDays}</p>
              </div>
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-950 rounded-xl flex items-center justify-center">
                <i className="fas fa-hourglass-half text-2xl text-purple-600 dark:text-purple-400"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-neutral-900 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-heading font-bold text-black dark:text-white">{plan.name}</h3>
            <span className="text-sm text-gray-600 dark:text-neutral-400">
              {completedDays} of {plan.duration} days
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-neutral-900 rounded-full h-4">
            <div 
              className={`bg-gradient-to-r from-${plan.color}-500 to-${plan.color}-600 h-4 rounded-full transition-all duration-500`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Current Week Schedule */}
        <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-neutral-900">
          <h3 className="text-xl font-heading font-bold text-black dark:text-white mb-6 flex items-center">
            <i className="fas fa-calendar-week text-emerald-600 dark:text-emerald-400 mr-2"></i>
            This Week's Reading
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {getCurrentWeek().map((item) => {
              const isCompleted = progress[item.day]?.completed
              const isToday = item.day === new Date().getDate() // Simplified for demo
              
              return (
                <div
                  key={item.day}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isCompleted
                      ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                      : isToday
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                      : 'border-gray-200 dark:border-neutral-900 bg-gray-50 dark:bg-neutral-900'
                  }`}
                >
                  <div className="text-center mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isToday
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400'
                    }`}>
                      {isCompleted ? (
                        <i className="fas fa-check text-sm"></i>
                      ) : (
                        <span className="text-sm font-bold">{item.day}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-neutral-500">Day {item.day}</p>
                  </div>
                  
                  <div className="text-center mb-4">
                    <p className="text-sm font-medium text-black dark:text-white mb-1">{item.reading}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.testament === 'old'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        : 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300'
                    }`}>
                      {item.testament === 'old' ? 'Old Testament' : 'New Testament'}
                    </span>
                  </div>
                  
                  <div className="text-center">
                    {isCompleted ? (
                      <button
                        onClick={() => markAsUnread(item.day)}
                        className="px-3 py-1 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-lg text-xs font-medium hover:bg-red-200 dark:hover:bg-red-900 transition-colors"
                      >
                        Mark Unread
                      </button>
                    ) : (
                      <button
                        onClick={() => markAsRead(item.day)}
                        className="px-3 py-1 bg-green-600 dark:bg-green-700 text-white rounded-lg text-xs font-medium hover:bg-green-700 dark:hover:bg-green-800 transition-colors"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </MemberLayout>
  )
}
