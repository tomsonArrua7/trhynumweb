"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const FRAME_COUNT = 14 // 18209 to 18222
const START_FRAME = 18209

export function ApuAnimation() {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % FRAME_COUNT)
    }, 100) // 10fps for the stab animation
    return () => clearInterval(interval)
  }, [])

  const currentFrame = START_FRAME + frame

  return (
    <div className="relative h-24 w-24">
      <Image
        src={`/assets/${currentFrame}.bmp`}
        alt="Apu Animation"
        fill
        className="ao-sprite object-contain"
      />
    </div>
  )
}
