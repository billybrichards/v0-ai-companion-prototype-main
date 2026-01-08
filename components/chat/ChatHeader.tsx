"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import AnplexaLogo from "@/components/anplexa-logo"
import { Crown, User, Plus, Palette, MessageSquare, Settings, LogOut } from "lucide-react"

interface ChatHeaderProps {
  userName?: string
  isGuest?: boolean
  isSubscribed?: boolean
  pronounText?: string
  onSignIn?: () => void
  onUpgrade?: () => void
  onNewChat?: () => void
  onToggleTheme?: () => void
  onOpenFeedback?: () => void
  onLogout?: () => void
  children?: React.ReactNode // For conversation dropdown
}

/**
 * ChatHeader Component
 *
 * Header bar for chat interface with user controls and navigation.
 */
export function ChatHeader({
  userName,
  isGuest = false,
  isSubscribed = false,
  pronounText = "She/Her",
  onSignIn,
  onUpgrade,
  onNewChat,
  onToggleTheme,
  onOpenFeedback,
  onLogout,
  children,
}: ChatHeaderProps) {
  return (
    <header className="border-b border-border bg-card px-2 sm:px-6 py-2 sm:py-4 pt-[max(0.5rem,env(safe-area-inset-top))] shrink-0">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-2">
        {/* Logo & Branding */}
        <Link href="/" className="flex items-center gap-1.5 sm:gap-3 min-w-0 hover:opacity-80 transition-opacity">
          <AnplexaLogo size={24} className="shrink-0 sm:w-8 sm:h-8" />
          <div className="min-w-0">
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <h1 className="text-base sm:text-xl font-heading font-light tracking-wide text-foreground lowercase truncate">
                anplexa
              </h1>
              {isSubscribed ? (
                <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-primary border border-primary/50 px-3 sm:px-4 py-1.5 text-[11px] sm:text-sm font-black text-white glow shrink-0 shadow-[0_0_20px_rgba(251,191,36,0.6)] animate-pulse">
                  <Crown className="h-3 w-3 sm:h-4 sm:w-4 fill-white" />
                  PRO MEMBER
                </span>
              ) : (
                <span className="rounded-full bg-primary/20 border border-primary/50 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-xs font-medium text-primary shrink-0">
                  BETA
                </span>
              )}
            </div>
            <p className="text-[10px] sm:text-sm text-muted-foreground truncate">
              The Private Pulse • {pronounText}
            </p>
          </div>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Conversation dropdown slot */}
          {children}

          {isGuest ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onSignIn}
              className="h-8 sm:h-9 gap-1 text-xs border-primary/50 text-primary hover:bg-primary/10 glow-hover min-touch-target"
            >
              <User className="h-3 w-3" />
              <span className="hidden xs:inline">Sign In</span>
            </Button>
          ) : (
            <>
              {userName && (
                <span className="text-xs sm:text-sm text-muted-foreground hidden md:inline max-w-[100px] truncate">
                  {userName}
                </span>
              )}
              {!isSubscribed && onUpgrade && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={onUpgrade}
                  className="h-9 sm:h-11 gap-2 text-sm font-black bg-gradient-to-r from-primary to-purple-600 text-white hover:scale-105 active:scale-95 transition-all glow shadow-[0_0_25px_rgba(123,44,191,0.6)] px-5 rounded-full shrink-0 border-2 border-white/20"
                >
                  <Crown className="h-4 w-4 fill-white" />
                  UPGRADE
                </Button>
              )}
            </>
          )}

          {onNewChat && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onNewChat}
              className="h-9 w-9 sm:h-10 sm:w-10 hover:bg-primary/10 hover:text-primary min-touch-target"
              title="New Chat"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}

          {onToggleTheme && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleTheme}
              className="h-9 w-9 sm:h-10 sm:w-10 hover:bg-primary/10 hover:text-primary min-touch-target hidden sm:flex"
              title="Theme"
            >
              <Palette className="h-4 w-4" />
            </Button>
          )}

          {!isGuest && (
            <>
              {onOpenFeedback && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onOpenFeedback}
                  className="h-9 w-9 sm:h-10 sm:w-10 hover:bg-primary/10 hover:text-primary min-touch-target hidden sm:flex"
                  title="Feedback"
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              )}
              <Link href="/account">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 sm:h-10 sm:w-10 hover:bg-primary/10 hover:text-primary min-touch-target"
                  title="Account Settings"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
              {onLogout && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onLogout}
                  className="h-9 w-9 sm:h-10 sm:w-10 hover:bg-primary/10 hover:text-primary min-touch-target"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
