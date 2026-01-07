"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, Check, Clock, Users, DollarSign } from "lucide-react"
import AnplexaLogo from "@/components/anplexa-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FormData {
  firstName: string
  lastName: string
  workEmail: string
  companyName: string
  role: string
  useCase: string
  expectedApiCalls: string
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    workEmail: "",
    companyName: "",
    role: "",
    useCase: "",
    expectedApiCalls: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const expectations = [
    { icon: Users, text: "Personalized demo" },
    { icon: Check, text: "Technical deep-dive" },
    { icon: DollarSign, text: "Custom pricing" },
    { icon: Clock, text: "Response within 24 hours" },
  ]

  if (isSubmitted) {
    return (
      <div className="min-h-[100dvh] bg-background text-foreground">
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-md safe-top">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-4 h-4" />
              <AnplexaLogo size={24} />
              <span className="font-heading text-lg sm:text-xl lowercase">anplexa</span>
              <span className="rounded-full bg-primary/20 border border-primary/50 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium text-primary">BETA</span>
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-2xl px-4 sm:px-6 py-16 sm:py-24 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-semibold mb-4">
            Demo Request Received
          </h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your interest in Anplexa. Our team will review your request and get back to you within 24 hours.
          </p>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md safe-top">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-4 h-4" />
            <AnplexaLogo size={24} />
            <span className="font-heading text-lg sm:text-xl lowercase">anplexa</span>
            <span className="rounded-full bg-primary/20 border border-primary/50 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium text-primary">BETA</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-heading font-semibold mb-2">
            Contact Sales
          </h1>
          <p className="text-muted-foreground">
            Get in touch with our team to learn how Anplexa can help your business.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Demo Request Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Request a Demo</CardTitle>
                <CardDescription>
                  Fill out the form below and we will get back to you shortly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* First Name, Last Name Grid */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium">
                        First Name
                      </label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Work Email */}
                  <div className="space-y-2">
                    <label htmlFor="workEmail" className="text-sm font-medium">
                      Work Email
                    </label>
                    <Input
                      id="workEmail"
                      name="workEmail"
                      type="email"
                      placeholder="john@company.com"
                      value={formData.workEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Company Name */}
                  <div className="space-y-2">
                    <label htmlFor="companyName" className="text-sm font-medium">
                      Company Name
                    </label>
                    <Input
                      id="companyName"
                      name="companyName"
                      placeholder="Acme Inc."
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Role Select */}
                  <div className="space-y-2">
                    <label htmlFor="role" className="text-sm font-medium">
                      Role
                    </label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => handleSelectChange("role", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cto-technical-lead">CTO/Technical Lead</SelectItem>
                        <SelectItem value="product-manager">Product Manager</SelectItem>
                        <SelectItem value="engineering-manager">Engineering Manager</SelectItem>
                        <SelectItem value="founder-ceo">Founder/CEO</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Use Case Description */}
                  <div className="space-y-2">
                    <label htmlFor="useCase" className="text-sm font-medium">
                      Use Case Description
                    </label>
                    <Textarea
                      id="useCase"
                      name="useCase"
                      placeholder="Describe how you plan to use Anplexa..."
                      value={formData.useCase}
                      onChange={handleInputChange}
                      rows={4}
                      required
                    />
                  </div>

                  {/* Expected Monthly API Calls */}
                  <div className="space-y-2">
                    <label htmlFor="expectedApiCalls" className="text-sm font-medium">
                      Expected Monthly API Calls
                    </label>
                    <Select
                      value={formData.expectedApiCalls}
                      onValueChange={(value) => handleSelectChange("expectedApiCalls", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select expected volume" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-10k">Under 10k</SelectItem>
                        <SelectItem value="10k-100k">10k - 100k</SelectItem>
                        <SelectItem value="100k-1m">100k - 1M</SelectItem>
                        <SelectItem value="1m-plus">1M+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Request Demo"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Direct Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Prefer to reach out directly?</CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href="mailto:enterprise@anplexa.com"
                  className="flex items-center gap-3 text-primary hover:underline"
                >
                  <Mail className="w-5 h-5" />
                  <span>enterprise@anplexa.com</span>
                </a>
              </CardContent>
            </Card>

            {/* What to Expect Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">What to expect</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {expectations.map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/50 px-4 sm:px-6 py-6 safe-bottom">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-xs text-muted-foreground/50">© 2025 Anplexa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
