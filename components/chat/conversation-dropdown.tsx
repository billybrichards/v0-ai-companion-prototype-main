"use client"

import { useState } from "react"
import { useConversationList } from "@/lib/infrastructure/hooks/use-conversation-list"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Plus, MessageSquare, Trash2, Loader2 } from "lucide-react"
import type { ConversationSummary } from "@/lib/domain/entities/conversation"

interface ConversationDropdownProps {
  disabled?: boolean
  className?: string
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onDelete,
}: {
  conversation: ConversationSummary
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isDeleting) return
    setIsDeleting(true)
    try {
      await onDelete()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <DropdownMenuItem
      className={`flex items-start gap-3 p-3 cursor-pointer group ${
        isActive ? "bg-primary/10" : ""
      }`}
      onClick={onSelect}
    >
      <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-sm font-medium truncate ${isActive ? "text-primary" : "text-foreground"}`}>
            {conversation.title}
          </span>
          <span className="text-xs text-muted-foreground shrink-0">
            {formatRelativeTime(conversation.updatedAt)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {conversation.preview}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
        )}
      </Button>
    </DropdownMenuItem>
  )
}

function ConversationGroup({
  label,
  conversations,
  activeId,
  onSelect,
  onDelete,
}: {
  label: string
  conversations: ConversationSummary[]
  activeId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}) {
  if (conversations.length === 0) return null

  return (
    <>
      <DropdownMenuLabel className="text-xs text-muted-foreground font-normal px-3 py-1.5">
        {label}
      </DropdownMenuLabel>
      {conversations.map((conv) => (
        <ConversationItem
          key={conv.id}
          conversation={conv}
          isActive={conv.id === activeId}
          onSelect={() => onSelect(conv.id)}
          onDelete={() => onDelete(conv.id)}
        />
      ))}
    </>
  )
}

export function ConversationDropdown({ disabled, className }: ConversationDropdownProps) {
  const {
    conversations,
    groupedConversations,
    activeConversationId,
    isLoading,
    switchTo,
    deleteConversation,
    startNew,
  } = useConversationList()

  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const handleStartNew = async () => {
    if (isCreating) return
    setIsCreating(true)
    try {
      await startNew()
      setIsOpen(false)
    } finally {
      setIsCreating(false)
    }
  }

  const handleSelect = async (id: string) => {
    await switchTo(id)
    setIsOpen(false)
  }

  const handleDelete = async (id: string) => {
    await deleteConversation(id)
  }

  // Get current conversation title for button
  const activeConv = conversations.find((c) => c.id === activeConversationId)
  const buttonLabel = activeConv?.title || "Conversations"

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 gap-1.5 text-xs sm:text-sm font-medium ${className}`}
          disabled={disabled || isLoading}
        >
          <MessageSquare className="h-4 w-4" />
          <span className="max-w-[120px] sm:max-w-[200px] truncate">{buttonLabel}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[300px] sm:w-[350px] max-h-[400px] overflow-y-auto"
      >
        {/* New Conversation Button */}
        <DropdownMenuItem
          className="flex items-center gap-2 p-3 cursor-pointer text-primary font-medium"
          onClick={handleStartNew}
          disabled={isCreating}
        >
          {isCreating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          New Conversation
        </DropdownMenuItem>

        {conversations.length > 0 && <DropdownMenuSeparator />}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && conversations.length === 0 && (
          <div className="text-center py-6 px-4">
            <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No conversations yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Start a new conversation to begin
            </p>
          </div>
        )}

        {/* Grouped Conversations */}
        {!isLoading && conversations.length > 0 && (
          <>
            <ConversationGroup
              label="Today"
              conversations={groupedConversations.today}
              activeId={activeConversationId}
              onSelect={handleSelect}
              onDelete={handleDelete}
            />
            <ConversationGroup
              label="Yesterday"
              conversations={groupedConversations.yesterday}
              activeId={activeConversationId}
              onSelect={handleSelect}
              onDelete={handleDelete}
            />
            <ConversationGroup
              label="This Week"
              conversations={groupedConversations.thisWeek}
              activeId={activeConversationId}
              onSelect={handleSelect}
              onDelete={handleDelete}
            />
            <ConversationGroup
              label="Older"
              conversations={groupedConversations.older}
              activeId={activeConversationId}
              onSelect={handleSelect}
              onDelete={handleDelete}
            />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ConversationDropdown
