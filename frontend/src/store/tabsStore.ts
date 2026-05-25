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
    headers: models.main.ResponseHeader[]
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

    updateDraft: (id: string, updates: Partial<RequestDraft>) => void
    sendActiveRequest: () => Promise<void>
}

const createDefaultDraft = (): RequestDraft => {
    return({
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

    return({
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

const initialTab = createDefaultTab()
export const useTabsStore = create<TabsStore>((set,get) => ({

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
            const {tabs, activeTabId} = get()

            let filtered = tabs.filter((tab) => tab.id !== id)

            let nextActiveId = activeTabId

            if(activeTabId === id) {
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
                const req = new models.main.APIRequest({
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
}))
