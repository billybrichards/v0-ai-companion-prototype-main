"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PersonalityMode {
  id: string
  name: string
}

interface PreferencesBarProps {
  length: "brief" | "moderate" | "detailed"
  personalityMode: string
  personalityModes: PersonalityMode[]
  onLengthChange: (value: "brief" | "moderate" | "detailed") => void
  onPersonalityChange: (value: string) => void
}

const lengthDescriptions = {
  brief: "Quick responses",
  moderate: "Balanced length",
  detailed: "In-depth responses",
}

/**
 * PreferencesBar Component
 *
 * Controls for response length and personality mode.
 */
export function PreferencesBar({
  length,
  personalityMode,
  personalityModes,
  onLengthChange,
  onPersonalityChange,
}: PreferencesBarProps) {
  return (
    <div className="hidden sm:flex flex-col sm:flex-row gap-2 sm:gap-3 px-3 sm:px-4 py-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-xs sm:text-sm font-medium text-muted-foreground shrink-0">
          Length:
        </span>
        <Select value={length} onValueChange={onLengthChange}>
          <SelectTrigger className="h-9 sm:h-10 flex-1 sm:w-[160px] sm:flex-none border border-border bg-background rounded-lg focus:border-primary focus:ring-primary/30 text-xs sm:text-sm min-touch-target">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(lengthDescriptions).map(([key, desc]) => (
              <SelectItem key={key} value={key} className="text-xs sm:text-sm">
                {desc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-xs sm:text-sm font-medium text-muted-foreground shrink-0">
          Personality:
        </span>
        <Select value={personalityMode} onValueChange={onPersonalityChange}>
          <SelectTrigger className="h-9 sm:h-10 flex-1 sm:w-[180px] sm:flex-none border border-border bg-background rounded-lg focus:border-primary focus:ring-primary/30 text-xs sm:text-sm min-touch-target">
            <SelectValue placeholder="Select personality" />
          </SelectTrigger>
          <SelectContent>
            {personalityModes.length > 0 ? (
              personalityModes.map((mode) => (
                <SelectItem key={mode.id} value={mode.id} className="text-xs sm:text-sm">
                  {mode.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="nurturing" className="text-xs sm:text-sm">
                Nurturing
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
