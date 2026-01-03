"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface PhoneMockupProps {
  images: string[]
  interval?: number
}

export default function PhoneMockup({ images, interval = 4000 }: PhoneMockupProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, interval])

  return (
    <div className="relative mx-auto w-[280px] sm:w-[320px] md:w-[300px] lg:w-[320px]">
      <div className="relative rounded-[3rem] border-[8px] border-[#2a2a2a] bg-[#1a1a1a] p-2 shadow-[0_0_60px_rgba(123,44,191,0.3)]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#1a1a1a] rounded-b-2xl z-10" />
        
        <div className="relative overflow-hidden rounded-[2.5rem] bg-background aspect-[9/16]">
          {images.map((src, index) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={src}
                alt={`Companion preview ${index + 1}`}
                fill
                className="object-cover object-top"
                priority={index === 0}
              />
            </div>
          ))}
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? "bg-primary w-4" 
                    : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full" />
    </div>
  )
}
