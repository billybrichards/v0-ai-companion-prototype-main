"use client"

import { posthog } from "./posthog"

interface UserProperties {
  email?: string
  displayName?: string
  isAdmin?: boolean
  subscriptionStatus?: string
  plan?: string
}

export const analytics = {
  identify: (userId: string, properties?: UserProperties) => {
    if (typeof window === "undefined") return
    posthog.identify(userId, properties)
  },

  reset: () => {
    if (typeof window === "undefined") return
    posthog.reset()
  },

  setUserProperties: (properties: UserProperties) => {
    if (typeof window === "undefined") return
    posthog.people.set(properties)
  },

  userSignedUp: (email: string, method: "email" | "magic_link" = "email", funnel?: string) => {
    if (typeof window === "undefined") return
    posthog.capture("user_signed_up", {
      email,
      method,
      funnel_persona: funnel,
      $set: { email },
    })
  },

  userLoggedIn: (email: string, method: "email" | "magic_link" = "email") => {
    if (typeof window === "undefined") return
    posthog.capture("user_logged_in", { email, method })
  },

  userLoggedOut: () => {
    if (typeof window === "undefined") return
    posthog.capture("user_logged_out")
    posthog.reset()
  },

  magicLinkSent: (email: string) => {
    if (typeof window === "undefined") return
    posthog.capture("magic_link_sent", { email })
  },

  magicLinkVerified: (email: string) => {
    if (typeof window === "undefined") return
    posthog.capture("magic_link_verified", { email })
  },

  checkoutStarted: (plan: string, price: number, currency: string = "GBP") => {
    if (typeof window === "undefined") return
    posthog.capture("checkout_started", {
      plan,
      price,
      currency,
      $set: { attempted_subscription: true },
    })
  },

  checkoutCompleted: (plan: string, customerId?: string, subscriptionId?: string) => {
    if (typeof window === "undefined") return
    posthog.capture("checkout_completed", {
      plan,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      $set: { subscription_status: "subscribed", plan },
    })
  },

  subscriptionVerified: (plan: string) => {
    if (typeof window === "undefined") return
    posthog.capture("subscription_verified", {
      plan,
      $set: { subscription_status: "subscribed", plan },
    })
  },

  upgradeModalShown: (messageCount: number, isAuthenticated: boolean) => {
    if (typeof window === "undefined") return
    posthog.capture("upgrade_modal_shown", {
      message_count: messageCount,
      is_authenticated: isAuthenticated,
    })
  },

  upgradeClicked: (source: string, plan?: string) => {
    if (typeof window === "undefined") return
    posthog.capture("upgrade_clicked", { source, plan })
  },

  messageSent: (messageLength: number, isGuest: boolean, messageCount: number) => {
    if (typeof window === "undefined") return
    posthog.capture("message_sent", {
      message_length: messageLength,
      is_guest: isGuest,
      message_count: messageCount,
    })
  },

  aiResponseReceived: (responseLength: number, responseTime?: number, isGuest?: boolean) => {
    if (typeof window === "undefined") return
    posthog.capture("ai_response_received", {
      response_length: responseLength,
      response_time_ms: responseTime,
      is_guest: isGuest,
    })
  },

  newConversationStarted: (isGuest: boolean) => {
    if (typeof window === "undefined") return
    posthog.capture("new_conversation_started", { is_guest: isGuest })
  },

  conversationLoaded: (messageCount: number) => {
    if (typeof window === "undefined") return
    posthog.capture("conversation_loaded", { message_count: messageCount })
  },

  genderSelected: (gender: string, isCustom: boolean) => {
    if (typeof window === "undefined") return
    posthog.capture("gender_selected", {
      gender,
      is_custom: isCustom,
      $set: { companion_gender: gender },
    })
  },

  companionNameSet: (hasCustomName: boolean) => {
    if (typeof window === "undefined") return
    posthog.capture("companion_name_set", { has_custom_name: hasCustomName })
  },

  onboardingCompleted: (gender: string, hasCustomName: boolean) => {
    if (typeof window === "undefined") return
    posthog.capture("onboarding_completed", {
      companion_gender: gender,
      has_custom_name: hasCustomName,
      $set: { onboarding_completed: true },
    })
  },

  funnelDetected: (persona: string, plan?: string) => {
    if (typeof window === "undefined") return
    posthog.capture("funnel_detected", {
      funnel_persona: persona,
      funnel_plan: plan,
      $set: { funnel_persona: persona },
    })
  },

  settingsOpened: () => {
    if (typeof window === "undefined") return
    posthog.capture("settings_opened")
  },

  feedbackOpened: () => {
    if (typeof window === "undefined") return
    posthog.capture("feedback_opened")
  },

  feedbackSubmitted: (rating?: number) => {
    if (typeof window === "undefined") return
    posthog.capture("feedback_submitted", { rating })
  },

  errorOccurred: (errorType: string, errorMessage?: string, context?: string) => {
    if (typeof window === "undefined") return
    posthog.capture("error_occurred", {
      error_type: errorType,
      error_message: errorMessage,
      context,
    })
  },
}
