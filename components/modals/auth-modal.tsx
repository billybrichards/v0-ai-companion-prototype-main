"use client"

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import AuthForm from "@/components/auth-form"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AuthModal({ open, onOpenChange, onSuccess }: AuthModalProps) {
  const handleSuccess = () => {
    onSuccess?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 bg-background border-border overflow-hidden h-auto max-h-[90vh]">
        <VisuallyHidden>
          <DialogTitle>Sign in to Anplexa</DialogTitle>
          <DialogDescription>Create an account or sign in to continue chatting.</DialogDescription>
        </VisuallyHidden>
        <AuthForm onSuccess={handleSuccess} embedded />
      </DialogContent>
    </Dialog>
  )
}

export default AuthModal
