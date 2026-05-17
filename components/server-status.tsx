"use client"

import { useState, useEffect } from "react"
import { Shield, ShieldAlert, Activity } from "lucide-react"

export function ServerStatus() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null)
  const [onlines, setOnlines] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  const checkStatus = async () => {
    try {
      const response = await fetch("/api/status")
      const data = await response.json()
      setIsOnline(data.online)
      setOnlines(data.onlines || 0)
    } catch (error) {
      console.error("Error checking status:", error)
      setIsOnline(false)
      setOnlines(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  if (loading) {
    return (
      <div className="mt-8 flex flex-col items-center gap-2">
        <div className="flex h-12 items-center justify-center gap-3 rounded-md border border-white/10 bg-black/40 px-6 backdrop-blur-sm">
          <Activity className="h-4 w-4 animate-pulse text-muted-foreground" />
          <span className="font-serif text-sm tracking-widest text-muted-foreground uppercase font-bold">
            Verificando Estado...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-500">
      {isOnline ? (
        <div className="flex flex-col items-center gap-3">
          <div className="group relative">
            <div className="absolute -inset-0.5 rounded-md bg-emerald-500/20 blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="relative flex h-14 items-center justify-center gap-4 rounded-md border border-emerald-500/30 bg-black/60 px-8 py-2 shadow-[0_0_20px_rgba(16,185,129,0.1)] backdrop-blur-md">
              <div className="relative flex items-center justify-center">
                <Shield className="h-6 w-6 text-emerald-500" />
                <div className="absolute h-2 w-2 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="font-serif text-lg tracking-[0.2em] text-emerald-400 uppercase font-bold drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                  SERVIDOR ONLINE
                </span>
                <span className="text-[9px] tracking-[0.1em] text-emerald-500/70 uppercase font-medium">
                  Listo para la batalla
                </span>
              </div>
            </div>
          </div>
          
        </div>
      ) : (
        <div className="group relative">
          <div className="absolute -inset-0.5 rounded-md bg-rose-500/20 blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex h-14 items-center justify-center gap-4 rounded-md border border-rose-500/30 bg-black/60 px-8 py-2 shadow-[0_0_20px_rgba(244,63,94,0.1)] backdrop-blur-md">
            <ShieldAlert className="h-6 w-6 text-rose-500" />
            <div className="flex flex-col items-start leading-tight">
              <span className="font-serif text-lg tracking-[0.2em] text-rose-500 uppercase font-bold drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]">
                SERVIDOR OFFLINE
              </span>
              <span className="text-[9px] tracking-[0.1em] text-rose-500/70 uppercase font-medium">
                Mantenimiento en curso
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
