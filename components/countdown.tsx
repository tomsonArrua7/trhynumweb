"use client"

import { useState, useEffect } from "react"

const TARGET_DATE = new Date("2026-05-07T21:00:00-03:00")

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const diff = TARGET_DATE.getTime() - now.getTime()

      if (diff <= 0) {
        clearInterval(timer)
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mt-8 flex flex-col items-center gap-2">
      <p className="font-serif text-[10px] tracking-[0.4em] text-primary uppercase font-bold animate-pulse">
        Gran Apertura en
      </p>
      <div className="flex gap-2 sm:gap-4">
        {[
          { label: "HS", value: timeLeft.hours },
          { label: "MIN", value: timeLeft.minutes },
          { label: "SEG", value: timeLeft.seconds },
        ].map((unit) => (
          <div key={unit.label} className="flex flex-col items-center">
            <div className="texture-iron flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center border-2 border-primary/50 bg-black/60 shadow-[0_0_20px_rgba(255,0,0,0.1)]">
              <div className="rivet top-1 left-1 w-1 h-1" />
              <div className="rivet top-1 right-1 w-1 h-1" />
              <div className="rivet bottom-1 left-1 w-1 h-1" />
              <div className="rivet bottom-1 right-1 w-1 h-1" />
              <span className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                {String(unit.value).padStart(2, "0")}
              </span>
            </div>
            <span className="mt-2 text-[6px] sm:text-[8px] tracking-[0.2em] text-muted-foreground uppercase font-bold">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
