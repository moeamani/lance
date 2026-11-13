import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { activeProjects as seedProjects, conversations as seedConversations, me, notifications as seedNotifications, type ActiveProject, type Conversation, type Message, type Notification } from '../data/mock'

export type Role = 'freelancer' | 'employer'

type User = { name: string; phone: string; verified: boolean; plus: boolean }

type State = {
  role: Role
  user: User | null
  bookmarks: string[]
  projects: ActiveProject[]
  conversations: Conversation[]
  notifications: Notification[]
  sentProposals: string[]
}

type Store = State & {
  unreadMessages: number
  unreadNotifications: number
  setRole: (r: Role) => void
  signIn: (u: Partial<User> & { phone: string }) => void
  signOut: () => void
  setVerified: (v: boolean) => void
  setPlus: (v: boolean) => void
  toggleBookmark: (id: string) => boolean
  isBookmarked: (id: string) => boolean
  updateProject: (id: string, fn: (p: ActiveProject) => ActiveProject) => void
  sendMessage: (convId: string, msg: Omit<Message, 'id' | 'at' | 'from'>) => void
  markConversationRead: (convId: string) => void
  markNotificationsRead: () => void
  sendProposal: (projectId: string) => void
}

const KEY = 'lance:v1'
const initial: State = {
  role: 'freelancer',
  user: { name: me.name, phone: me.phone, verified: false, plus: false },
  bookmarks: [],
  projects: seedProjects,
  conversations: seedConversations,
  notifications: seedNotifications,
  sentProposals: [],
}

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return initial
    return { ...initial, ...JSON.parse(raw) }
  } catch {
    return initial
  }
}

const Ctx = createContext<Store | null>(null)

/**
 * Tiny app store (context + localStorage). Enough for a clickable prototype
 * that remembers role, bookmarks, tasks and chat between reloads; replace
 * with TanStack Query + an API when the backend lands.
 */
export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* private mode — fine, state just won't persist */
    }
  }, [state])

  const setRole = useCallback((role: Role) => setState((s) => ({ ...s, role })), [])
  const signIn = useCallback<Store['signIn']>(
    (u) => setState((s) => ({ ...s, user: { name: u.name ?? s.user?.name ?? me.name, phone: u.phone, verified: s.user?.verified ?? false, plus: s.user?.plus ?? false } })),
    [],
  )
  const signOut = useCallback(() => setState((s) => ({ ...s, user: null })), [])
  const setVerified = useCallback((v: boolean) => setState((s) => (s.user ? { ...s, user: { ...s.user, verified: v } } : s)), [])
  const setPlus = useCallback((v: boolean) => setState((s) => (s.user ? { ...s, user: { ...s.user, plus: v } } : s)), [])

  const toggleBookmark = useCallback(
    (id: string) => {
      const has = state.bookmarks.includes(id)
      setState((s) => ({ ...s, bookmarks: has ? s.bookmarks.filter((b) => b !== id) : [...s.bookmarks, id] }))
      return !has
    },
    [state.bookmarks],
  )
  const isBookmarked = useCallback((id: string) => state.bookmarks.includes(id), [state.bookmarks])

  const updateProject = useCallback<Store['updateProject']>((id, fn) => setState((s) => ({ ...s, projects: s.projects.map((p) => (p.id === id ? fn(p) : p)) })), [])

  const sendMessage = useCallback<Store['sendMessage']>(
    (convId, msg) =>
      setState((s) => ({
        ...s,
        conversations: s.conversations.map((c) =>
          c.id === convId ? { ...c, messages: [...c.messages, { ...msg, id: `m${Date.now()}`, at: new Date().toISOString(), from: 'me', read: false }] } : c,
        ),
      })),
    [],
  )
  const markConversationRead = useCallback((convId: string) => setState((s) => ({ ...s, conversations: s.conversations.map((c) => (c.id === convId ? { ...c, unread: 0 } : c)) })), [])
  const markNotificationsRead = useCallback(() => setState((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) })), [])
  const sendProposal = useCallback((projectId: string) => setState((s) => ({ ...s, sentProposals: [...new Set([...s.sentProposals, projectId])] })), [])

  const value = useMemo<Store>(
    () => ({
      ...state,
      unreadMessages: state.conversations.reduce((a, c) => a + c.unread, 0),
      unreadNotifications: state.notifications.filter((n) => !n.read).length,
      setRole,
      signIn,
      signOut,
      setVerified,
      setPlus,
      toggleBookmark,
      isBookmarked,
      updateProject,
      sendMessage,
      markConversationRead,
      markNotificationsRead,
      sendProposal,
    }),
    [state, setRole, signIn, signOut, setVerified, setPlus, toggleBookmark, isBookmarked, updateProject, sendMessage, markConversationRead, markNotificationsRead, sendProposal],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used inside <AppStoreProvider>')
  return ctx
}
