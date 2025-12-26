"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function ThemeCustomizer() {
  const [primaryHue, setPrimaryHue] = useState(220)
  const [useOrangeAccent, setUseOrangeAccent] = useState(false)

  useEffect(() => {
    // Load saved theme preferences
    const savedHue = localStorage.getItem("theme-primary-hue")
    const savedOrange = localStorage.getItem("theme-use-orange")

    if (savedHue) setPrimaryHue(Number.parseInt(savedHue))
    if (savedOrange) setUseOrangeAccent(savedOrange === "true")

    applyTheme(savedHue ? Number.parseInt(savedHue) : 220, savedOrange === "true")
  }, [])

  const applyTheme = (hue: number, orange: boolean) => {
    const root = document.documentElement
    root.style.setProperty("--primary", `oklch(0.45 0.15 ${hue})`)
    root.style.setProperty("--ring", `oklch(0.45 0.15 ${hue})`)

    if (orange) {
      root.style.setProperty("--accent", `oklch(0.65 0.15 45)`)
    } else {
      root.style.setProperty("--accent", `oklch(0.65 0.12 ${hue + 40})`)
    }
  }

  const handleHueChange = (value: number) => {
    setPrimaryHue(value)
    localStorage.setItem("theme-primary-hue", value.toString())
    applyTheme(value, useOrangeAccent)
  }

  const handleOrangeToggle = () => {
    const newValue = !useOrangeAccent
    setUseOrangeAccent(newValue)
    localStorage.setItem("theme-use-orange", newValue.toString())
    applyTheme(primaryHue, newValue)
  }

  const presets = [
    { name: "Blue", hue: 220 },
    { name: "Green", hue: 140 },
    { name: "Purple", hue: 280 },
    { name: "Red", hue: 10 },
    { name: "Cyan", hue: 180 },
  ]

  return (
    <div className="mx-auto mt-4 max-w-4xl border-2 border-border bg-background p-4">
      <div className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-bold text-foreground">PRIMARY COLOR</label>
            <span className="text-xs text-muted-foreground font-mono">HUE: {primaryHue}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={primaryHue}
            onChange={(e) => handleHueChange(Number.parseInt(e.target.value))}
            className="w-full"
          />
          <div className="mt-2 flex gap-2">
            {presets.map((preset) => (
              <Button
                key={preset.name}
                onClick={() => handleHueChange(preset.hue)}
                variant={primaryHue === preset.hue ? "default" : "outline"}
                size="sm"
                className="text-xs"
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-foreground">ORANGE ACCENT</div>
            <div className="text-xs text-muted-foreground">Use orange for accent color</div>
          </div>
          <Button onClick={handleOrangeToggle} variant={useOrangeAccent ? "default" : "outline"} size="sm">
            {useOrangeAccent ? "ON" : "OFF"}
          </Button>
        </div>
      </div>
    </div>
  )
}
