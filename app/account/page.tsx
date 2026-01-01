"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { ArrowLeft, User, Shield, Database, Download, Trash2, Mail, Lock, Loader2, Check, AlertTriangle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import AnplexaLogo from "@/components/anplexa-logo"
import { toast } from "sonner"

type PrivacySettings = {
  analyticsOptIn: boolean
  personalizedAi: boolean
  marketingEmails: boolean
}

export default function AccountPage() {
  const { user, accessToken, logout } = useAuth()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<"profile" | "privacy" | "data">("profile")
  const [isExporting, setIsExporting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    analyticsOptIn: true,
    personalizedAi: true,
    marketingEmails: false,
  })
  const [isSavingPrivacy, setIsSavingPrivacy] = useState(false)
  const [isLoadingPrivacy, setIsLoadingPrivacy] = useState(true)

  useEffect(() => {
    if (!user && !accessToken) {
      router.push("/")
    }
  }, [user, accessToken, router])

  useEffect(() => {
    const loadPrivacySettings = async () => {
      if (!accessToken) return
      
      try {
        const response = await fetch("/api/account/privacy", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          setPrivacySettings({
            analyticsOptIn: data.analyticsOptIn ?? true,
            personalizedAi: data.personalizedAi ?? true,
            marketingEmails: data.marketingEmails ?? false,
          })
        }
      } catch (error) {
        console.error("Failed to load privacy settings:", error)
      } finally {
        setIsLoadingPrivacy(false)
      }
    }
    
    loadPrivacySettings()
  }, [accessToken])

  const handleExportData = async () => {
    if (!accessToken) return
    
    setIsExporting(true)
    try {
      const response = await fetch("/api/account/export", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `anplexa-data-export-${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success("Your data has been exported successfully")
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to export data")
      }
    } catch (error) {
      console.error("Export error:", error)
      toast.error("Failed to export data")
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!accessToken || deleteConfirmText !== "DELETE") return
    
    setIsDeleting(true)
    try {
      const response = await fetch("/api/account/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      
      if (response.ok) {
        localStorage.clear()
        logout()
        toast.success("Your account has been deleted")
        router.push("/")
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to delete account")
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Failed to delete account")
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
      setDeleteConfirmText("")
    }
  }

  const handlePrivacyChange = async (key: keyof PrivacySettings, value: boolean) => {
    const previousSettings = { ...privacySettings }
    setPrivacySettings(prev => ({ ...prev, [key]: value }))
    setIsSavingPrivacy(true)
    
    try {
      const response = await fetch("/api/account/privacy", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ [key]: value }),
      })
      
      if (!response.ok) {
        setPrivacySettings(previousSettings)
        toast.error("Failed to update privacy settings")
      } else {
        toast.success("Privacy settings updated")
      }
    } catch {
      setPrivacySettings(previousSettings)
      toast.error("Failed to update privacy settings")
    } finally {
      setIsSavingPrivacy(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-background text-foreground safe-top safe-bottom">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3">
            <Link href="/dash">
              <Button variant="ghost" size="icon" className="h-9 w-9 min-touch-target">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <AnplexaLogo size={24} />
              <span className="text-base font-heading font-light tracking-wide lowercase hidden sm:inline">settings</span>
              <span className="rounded-full bg-primary/20 border border-primary/50 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium text-primary">BETA</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{user.displayName || user.email?.split("@")[0]}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
          <nav className="flex sm:flex-col gap-2 sm:w-48 shrink-0 overflow-x-auto pb-2 sm:pb-0">
            <Button
              variant={activeSection === "profile" ? "secondary" : "ghost"}
              className="justify-start gap-2 min-touch-target whitespace-nowrap"
              onClick={() => setActiveSection("profile")}
            >
              <User className="h-4 w-4" />
              Profile
            </Button>
            <Button
              variant={activeSection === "privacy" ? "secondary" : "ghost"}
              className="justify-start gap-2 min-touch-target whitespace-nowrap"
              onClick={() => setActiveSection("privacy")}
            >
              <Shield className="h-4 w-4" />
              Privacy
            </Button>
            <Button
              variant={activeSection === "data" ? "secondary" : "ghost"}
              className="justify-start gap-2 min-touch-target whitespace-nowrap"
              onClick={() => setActiveSection("data")}
            >
              <Database className="h-4 w-4" />
              Data
            </Button>
          </nav>

          <div className="flex-1 space-y-6">
            {activeSection === "profile" && (
              <>
                <div>
                  <h2 className="text-xl sm:text-2xl font-heading font-medium mb-1">Profile</h2>
                  <p className="text-sm text-muted-foreground">Manage your account information</p>
                </div>
                
                <Card className="p-4 sm:p-6 border-border bg-card rounded-xl">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{user.displayName || "Anonymous User"}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Subscription Status</p>
                          <p className="text-sm text-muted-foreground">
                            {user.subscriptionStatus === "subscribed" ? "PRO Member" : "Free Plan"}
                          </p>
                        </div>
                        {user.subscriptionStatus === "subscribed" ? (
                          <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                            Active
                          </span>
                        ) : (
                          <Link href="/dash?upgrade=true">
                            <Button size="sm" className="gradient-primary">
                              Upgrade
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {activeSection === "privacy" && (
              <>
                <div>
                  <h2 className="text-xl sm:text-2xl font-heading font-medium mb-1">Privacy Settings</h2>
                  <p className="text-sm text-muted-foreground">Control how your data is used</p>
                </div>
                
                <Card className="p-4 sm:p-6 border-border bg-card rounded-xl">
                  <div className="space-y-6">
                    {isLoadingPrivacy ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-medium">Analytics</p>
                            <p className="text-sm text-muted-foreground">
                              Help us improve Anplexa by sharing anonymous usage data
                            </p>
                          </div>
                          <Switch
                            checked={privacySettings.analyticsOptIn}
                            onCheckedChange={(checked: boolean) => handlePrivacyChange("analyticsOptIn", checked)}
                            disabled={isSavingPrivacy}
                          />
                        </div>
                        
                        <div className="flex items-start justify-between gap-4 pt-4 border-t border-border">
                          <div className="flex-1">
                            <p className="font-medium">Personalized AI</p>
                            <p className="text-sm text-muted-foreground">
                              Allow AI to remember conversation context for better responses
                            </p>
                          </div>
                          <Switch
                            checked={privacySettings.personalizedAi}
                            onCheckedChange={(checked: boolean) => handlePrivacyChange("personalizedAi", checked)}
                            disabled={isSavingPrivacy}
                          />
                        </div>
                        
                        <div className="flex items-start justify-between gap-4 pt-4 border-t border-border">
                          <div className="flex-1">
                            <p className="font-medium">Marketing Emails</p>
                            <p className="text-sm text-muted-foreground">
                              Receive updates about new features and promotions
                            </p>
                          </div>
                          <Switch
                            checked={privacySettings.marketingEmails}
                            onCheckedChange={(checked: boolean) => handlePrivacyChange("marketingEmails", checked)}
                            disabled={isSavingPrivacy}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </Card>

                <Card className="p-4 sm:p-6 border-border bg-card rounded-xl">
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Your Rights Under GDPR</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        You have the right to access, rectify, and delete your personal data. 
                        You can also request data portability and restrict or object to processing.
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>For privacy inquiries, contact: <a href="mailto:privacy@anplexa.com" className="text-primary hover:underline">privacy@anplexa.com</a></p>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {activeSection === "data" && (
              <>
                <div>
                  <h2 className="text-xl sm:text-2xl font-heading font-medium mb-1">Data Management</h2>
                  <p className="text-sm text-muted-foreground">Export or delete your data</p>
                </div>
                
                <Card className="p-4 sm:p-6 border-border bg-card rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                      <Download className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Export Your Data</p>
                      <p className="text-sm text-muted-foreground mt-1 mb-4">
                        Download a copy of all your data including messages, preferences, and account information in JSON format.
                      </p>
                      <Button
                        onClick={handleExportData}
                        disabled={isExporting}
                        className="min-touch-target"
                      >
                        {isExporting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Exporting...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Download My Data
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 sm:p-6 border-destructive/50 bg-card rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-destructive/20 flex items-center justify-center shrink-0">
                      <Trash2 className="h-5 w-5 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-destructive">Delete Account</p>
                      <p className="text-sm text-muted-foreground mt-1 mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <Button
                        variant="destructive"
                        onClick={() => setShowDeleteDialog(true)}
                        className="min-touch-target"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete My Account
                      </Button>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              This action is permanent and cannot be undone. All your data will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
              <p className="text-sm font-medium text-destructive mb-2">You will lose:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• All your conversation history</li>
                <li>• Your preferences and settings</li>
                <li>• Your subscription (if active)</li>
                <li>• Access to your account</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Type DELETE to confirm
              </label>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                placeholder="DELETE"
                className="border-border"
              />
            </div>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false)
                setDeleteConfirmText("")
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== "DELETE" || isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Forever"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
