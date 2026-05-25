import { Header, Param } from "@/types/global"
import { formatResponseBody, getDomain, getPathname } from "@/lib/utils"
import { api } from "@/services/api"
import { create } from "zustand"
import * as models from "../../wailsjs/go/models"

export type RequestDraft = {
    method: string
    url: string
    body: string

    headers: Header[]
    params: Param[]
}

export type ResponseDraft = {
    body: string
    status: number
    time: number
    size: string
    headers: models.domain.ResponseHeader[]
}

export type RequestTab = {
    id: string
    title: string
    dirty: boolean
    loading: boolean
    error: string

    createdAt: number
    updatedAt: number

    draft: RequestDraft
    response: ResponseDraft
}

type TabsStore = {
    tabs: RequestTab[]
    activeTabId: string | null

    createTab: (draft?: Partial<RequestDraft>) => void
    closeTab: (id: string) => void
    setActiveTab: (id: string) => void
    reorderTabs: (draggedId: string, targetId: string) => void

    updateDraft: (id: string, updates: Partial<RequestDraft>) => void
    sendActiveRequest: () => Promise<void>


    loadTabsState: () => Promise<void>
}

const createDefaultDraft = (): RequestDraft => {
    return ({
        method: "GET",
        url: "",
        body: "",

        headers: [
            {
                key: "content-type",
                value: "application/json",
            },
        ],

        params: [],
    })
}

const createDefaultResponse = (): ResponseDraft => ({
    body: JSON.stringify(
        {
            message: "Welcome to Cloud Flash API",
        },
        null,
        2
    ),
    status: 200,
    time: 0,
    size: "0B",
    headers: [
        {
            key: "content-type",
            value: "application/json",
        },
    ],
})

const createTitle = (draft: RequestDraft) => {
    if (!draft.url.trim()) return "Untitled"

    const path = getPathname(draft.url)
    if (path && path !== "/") return path

    return getDomain(draft.url) || draft.url
}

const createDefaultTab = (draftUpdates: Partial<RequestDraft> = {}): RequestTab => {
    const draft = {
        ...createDefaultDraft(),
        ...draftUpdates,
        headers: draftUpdates.headers ?? createDefaultDraft().headers,
        params: draftUpdates.params ?? createDefaultDraft().params,
    }

    return ({
        id: crypto.randomUUID(),

        title: createTitle(draft),

        dirty: false,
        loading: false,
        error: "",

        createdAt: Date.now(),
        updatedAt: Date.now(),

        draft,
        response: createDefaultResponse(),
    })
}

let isInitialized = false
const initialTab = createDefaultTab()

export const useTabsStore = create<TabsStore>((set, get) => ({

    tabs: [initialTab],

    activeTabId: initialTab.id,

    createTab: (draft) => {
        const tab = createDefaultTab(draft)

        set((state) => ({
            tabs: [...state.tabs, tab],
            activeTabId: tab.id,
        }))
    },

    closeTab: (id) => {
        const { tabs, activeTabId } = get()

        let filtered = tabs.filter((tab) => tab.id !== id)

        let nextActiveId = activeTabId

        if (activeTabId === id) {
            nextActiveId = filtered[0]?.id ?? null
        }

        if (filtered.length === 0) {
            const tab = createDefaultTab()
            filtered = [tab]
            nextActiveId = tab.id
        }

        set({
            tabs: filtered,
            activeTabId: nextActiveId
        })
    },

    setActiveTab: (id) => set((state) => ({
        activeTabId: state.tabs.some((tab) => tab.id === id) ? id : state.activeTabId,
    })),

    reorderTabs: (draggedId, targetId) => {
        if (draggedId === targetId) return

        set((state) => {
            const draggedIndex = state.tabs.findIndex((tab) => tab.id === draggedId)
            const targetIndex = state.tabs.findIndex((tab) => tab.id === targetId)

            if (draggedIndex === -1 || targetIndex === -1) return state

            const tabs = [...state.tabs]
            const [draggedTab] = tabs.splice(draggedIndex, 1)
            tabs.splice(targetIndex, 0, draggedTab)

            return { tabs }
        })
    },

    updateDraft: (id, updates) => {
        set((state) => ({
            tabs: state.tabs.map((tab) => {
                if (tab.id !== id) return tab
                const draft = {
                    ...tab.draft,
                    ...updates,
                }

                return {
                    ...tab,

                    title: createTitle(draft),
                    dirty: true,
                    error: "",

                    updatedAt: Date.now(),

                    draft,
                }
            }),
        }))
    },

    sendActiveRequest: async () => {
        const { activeTabId, tabs } = get()
        const activeTab = tabs.find((tab) => tab.id === activeTabId)

        if (!activeTab) return

        const { method, url, body, headers, params } = activeTab.draft

        set((state) => ({
            tabs: state.tabs.map((tab) =>
                tab.id === activeTab.id
                    ? { ...tab, error: "", loading: true }
                    : tab
            ),
        }))

        try {
            const req = new models.domain.APIRequest({
                method,
                url,
                body,
                headers,
                params,
            })

            const res = await api.sendRequest(req)

            set((state) => ({
                tabs: state.tabs.map((tab) =>
                    tab.id === activeTab.id
                        ? {
                            ...tab,
                            dirty: false,
                            loading: false,
                            response: {
                                body: formatResponseBody(res.body),
                                status: res.status,
                                time: res.time,
                                size: res.size,
                                headers: res.headers ?? [],
                            },
                        }
                        : tab
                ),
            }))
        } catch (error) {
            set((state) => ({
                tabs: state.tabs.map((tab) =>
                    tab.id === activeTab.id
                        ? {
                            ...tab,
                            loading: false,
                            error: "failed to send request",
                            response: {
                                ...tab.response,
                                status: 0,
                                body: String(error),
                            },
                        }
                        : tab
                ),
            }))
        }
    },

    loadTabsState: async () => {
        try {
            const dbTabs = await api.getTabs()
            if (dbTabs && dbTabs.length > 0) {
                const mappedTabs = dbTabs.map((dbTab) => {
                    const draft: RequestDraft = {
                        method: dbTab.method || "GET",
                        url: dbTab.url || "",
                        body: dbTab.body || "",
                        headers: dbTab.headers || [],
                        params: dbTab.params || [],
                    }

                    const response: ResponseDraft = {
                        body: dbTab.response?.body || "",
                        status: dbTab.response?.status || 0,
                        time: dbTab.response?.time || 0,
                        size: dbTab.response?.size || "0B",
                        headers: dbTab.response?.headers || [],
                    }

                    return {
                        id: dbTab.id,
                        title: dbTab.title,
                        dirty: false,
                        loading: false,
                        error: "",
                        createdAt: dbTab.created_at || Date.now(),
                        updatedAt: dbTab.updated_at || Date.now(),
                        draft,
                        response,
                    } as RequestTab
                })

                const dbActiveTab = dbTabs.find((t) => t.is_active)
                const activeTabId = dbActiveTab ? dbActiveTab.id : (mappedTabs[0]?.id ?? null)

                set({
                    tabs: mappedTabs,
                    activeTabId,
                })
            }
        } catch (error) {
            console.error("Failed to load tabs state:", error)
        } finally {
            isInitialized = true
        }
    },
}))

let saveTimeout: NodeJS.Timeout | null = null

const debouncedSave = (state: TabsStore) => {
    if (!isInitialized) return

    if (saveTimeout) clearTimeout(saveTimeout)
    saveTimeout = setTimeout(() => {
        const tabsToSave: models.domain.Tab[] = state.tabs.map((tab, index) => {
            return new models.domain.Tab({
                id: tab.id,
                title: tab.title,
                method: tab.draft.method,
                url: tab.draft.url,
                body: tab.draft.body,
                headers: tab.draft.headers,
                params: tab.draft.params,
                response: new models.domain.APIResponse({
                    status: tab.response.status,
                    time: tab.response.time,
                    size: tab.response.size,
                    body: tab.response.body,
                    headers: tab.response.headers,
                }),
                position: index,
                is_active: tab.id === state.activeTabId,
                created_at: tab.createdAt,
                updated_at: tab.updatedAt,
            })
        })

        api.saveTabs(tabsToSave).catch((err) => {
            console.error("Failed to sync tabs to database:", err)
        })
    }, 500)
}

useTabsStore.subscribe(debouncedSave)

