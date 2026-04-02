"use client"

import { useState } from "react"
import StatCard from "./components/StatCard"

export default function Home() {
  const [step, setStep] = useState(1)
  const [gender, setGender] = useState("")
  const [unit, setUnit] = useState("metric")
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    neck: "",
    waist: "",
    hips: "",
    age: "",
  })
  const [targetBodyFat, setTargetBodyFat] = useState("")
  
  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const calculateBodyFat = (formData, gender, unit) => {
    if (!formData.height || !formData.waist || !formData.neck) 
      return null

    if (gender === "female" && !formData.hips)
      return null

    let bodyfat, height, waist, neck, hips


    if (unit === "imperial") {
      // Convert inches to cm and lbs to kg for the formula
      height = formData.height * 2.54
      waist = formData.waist * 2.54
      neck = formData.neck * 2.54
      hips = formData.hips ? formData.hips * 2.54 : null
    } else {
      height = formData.height
      waist = formData.waist
      neck = formData.neck
      hips = formData.hips
    }

    if (gender === "male") {
      bodyfat =  495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450
    } else {
      bodyfat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hips - neck) + 0.22100 * Math.log10(height)) - 450
    }

    return Math.round(bodyfat * 10) / 10
  }

  const calculateLBM = (formData, gender, unit) => {
    const bodyFat = calculateBodyFat(formData, gender, unit)
    if (bodyFat === null) return null

    let LBM = formData.weight * (1 - bodyFat / 100)
    return Math.round(LBM * 10) / 10
  }

  const calculateGoal = (formData, gender, unit, targetBodyFat) => {
    const LBM = calculateLBM(formData, gender, unit)
    if (LBM === null) return null

    const targetWeight = LBM / (1 - targetBodyFat / 100)
    const weightToLose = formData.weight - targetWeight
    
    return {
      targetWeight: Math.round(targetWeight * 10) / 10,
      weightToLose: Math.round(weightToLose * 10) / 10
    }
  }
  
  const bodyFat = calculateBodyFat(formData, gender, unit)
  const LBM = calculateLBM(formData, gender, unit)
  const goal = calculateGoal(formData, gender, unit, targetBodyFat)
    

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Step 1 - Welcome */}
        {step === 1 && (
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold">Body Tracker</h1>
            <p className="text-gray-400 text-lg">
              Most people guess their progress. You're about to measure it.
              Tracking your body composition tells you whether you're building muscle,
              losing fat, or just spinning your wheels.
            </p>
            <button
              onClick={() => setStep(2)}
              className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-200 transition"
            >
              Get Started
            </button>
          </div>
        )}

        {/* Step 2 - Gender */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">First, a few basics</h2>
            <p className="text-gray-400 text-center">The body fat formula differs by gender</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => { setGender("male"); setStep(3) }}
                className={`py-4 rounded-xl font-semibold border transition ${gender === "male" ? "bg-white text-black border-white" : "border-gray-700 hover:border-gray-400"}`}
              >
                Male
              </button>
              <button
                onClick={() => { setGender("female"); setStep(3) }}
                className={`py-4 rounded-xl font-semibold border transition ${gender === "female" ? "bg-white text-black border-white" : "border-gray-700 hover:border-gray-400"}`}
              >
                Female
              </button>
            </div>
          </div>
        )}

        {/* Step 3 - Units + Measurements */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Your measurements</h2>

            {/* Unit Toggle */}
            <div className="flex bg-gray-900 rounded-xl p-1">
              <button
                onClick={() => setUnit("metric")}
                className={`flex-1 py-2 rounded-lg font-medium transition ${unit === "metric" ? "bg-white text-black" : "text-gray-400"}`}
              >
                Metric (cm, kg)
              </button>
              <button
                onClick={() => setUnit("imperial")}
                className={`flex-1 py-2 rounded-lg font-medium transition ${unit === "imperial" ? "bg-white text-black" : "text-gray-400"}`}
              >
                Imperial (in, lbs)
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {[
                { label: "Age", field: "age", placeholder: "years" },
                { label: "Height", field: "height", placeholder: unit === "metric" ? "cm" : "inches" },
                { label: "Weight", field: "weight", placeholder: unit === "metric" ? "kg" : "lbs" },
                { label: "Neck circumference", field: "neck", placeholder: unit === "metric" ? "cm" : "inches" },
                { label: "Waist circumference", field: "waist", placeholder: unit === "metric" ? "cm" : "inches" },
                ...(gender === "female" ? [{ label: "Hip circumference", field: "hips", placeholder: unit === "metric" ? "cm" : "inches" }] : []),
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="block text-sm text-gray-400 mb-1">{label}</label>
                  <input
                    type="number"
                    placeholder={placeholder}
                    value={formData[field]}
                    onChange={(e) => updateFormData(field, e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-400"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep(4)}
              className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-200 transition"
            >
              Calculate
            </button>
          </div>
        )}

        {/* Step 4 - Placeholder for results */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Your Results</h2>
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Body Fat" value={bodyFat + "%"} />
              <StatCard label="Lean Body Mass" value={LBM + (unit === "metric" ? " kg" : " lbs")} />
            </div>
            <button
              onClick={() => setStep(3)}
              className="w-full border border-gray-700 text-white font-semibold py-3 rounded-xl hover:border-gray-400 transition"
            >
              Recalculate
            </button>
             <button
              onClick={() => setStep(5)}
              className="w-full border border-gray-700 text-white font-semibold py-3 rounded-xl hover:border-gray-400 transition"
            >
              Set Goals
            </button>
          </div>
        )}

        {/* Step 5 - Goal Setting */}
        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Set Your Goals</h2>
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">
                Your current body fat is <span className="text-white font-semibold">{calculateBodyFat(formData, gender, unit)}%</span>
              </p>
              <label className="block text-sm text-gray-400 mb-1">Target Body Fat Percentage</label>
              <input
                type="number"
                placeholder="target BF%"
                value={targetBodyFat}
                onChange={(e) => setTargetBodyFat(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-400"
              />
            </div>
            <button
            onClick={() => setStep(6)}
            className="w-full border border-gray-700 text-white font-semibold py-3 rounded-xl hover:border-gray-400 transition"
            >
              Results 
            </button>
          </div>
        )}

        {/* Step 6 - Final Result */}
        {step === 6 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Your Results</h2>
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Body Fat" value={bodyFat + "%"} />
              <StatCard label="Lean Body Mass" value={LBM + (unit === "metric" ? " kg" : " lbs")} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Target Weight" value={goal?.targetWeight + (unit === "metric" ? " kg" : " lbs")} />
              <StatCard label="Weight to Lose" value={goal?.weightToLose + (unit === "metric" ? " kg" : " lbs")} />
            </div>
          </div>
        )}

      </div>
    </main>
  )
}