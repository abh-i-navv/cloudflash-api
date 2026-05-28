import { create } from "zustand"
import * as models from "../../wailsjs/go/models"
import { api } from "@/services/api"
import { RequestDraft } from "./tabsStore"

export type Collection = {
    id: string
    name: string
    createdAt: number
    updatedAt: number
}

export type Folder = {
    id: string
    collectionId: string
    parentFolderId: string | null
    name: string
    createdAt: number
    updatedAt: number
}

export type SavedRequest = {
    id: string
    collectionId: string
    folderId: string | null
    name: string
    method: string
    url: string
    body: string
    headers: string
    params: string
    createdAt: number
    updatedAt: number
}

type CollectionsStore = {
    collections: Collection[]
    folders: Folder[]
    requests: SavedRequest[]

    selectedCollectionId: string | null
    expandedCollectionIds: Set<string>
    expandedFolderIds: Set<string>

    loadWorkspace: () => Promise<void>
    loadCollectionData: (collectionId: string) => void

    //collections CRUD
    createCollection: (name: string) => Promise<void>
    renameCollection: (id:string, name: string) => Promise<void>
    deleteCollection: (id:string) => Promise<void>

    //folder CRUD
    createFolder: ( collectionId: string ,parentFolderId: string | null, name: string) => Promise<void>
    renameFolder: (id: string, name:string) => Promise<void>
    deleteFolder: (id: string) => Promise<void>
    moveFolder: (id: string, collectionId: string, parentFolderId: string | null) => Promise<void>

    //saved requests CRUD
    saveRequest: (collectionId: string, folderId: string | null, name: string, draft: RequestDraft) => Promise<void>
    deleteRequest: (id: string) => Promise<void>
    moveRequest: (id: string, collectionId: string, folderId: string | null) => Promise<void>

    // UI state
    toggleCollection: (id: string) => void
    toggleFolder: (id: string) => void

    // helpers
    getCollectionFolders: (collectionId: string) => Folder[]
    getRootFolders: (collectionId: string) => Folder[]
    getChildFolders: (parentFolderId: string) => Folder[]
    getFolderRequests: (folderId: string) => SavedRequest[]
    getRootRequests: (collectionId: string) => SavedRequest[]

}


// mapping functions

function mapCollection(c: models.domain.Collection): Collection {
    return ({
        id: c.id,
        name: c.name,
        createdAt: c.created_at,
        updatedAt: c.updated_at
    })
}

function mapFolder(f: models.domain.Folder): Folder {
    return {
        id: f.id,
        collectionId: f.collection_id,
        parentFolderId: f.parent_folder_id ?? null,
        name: f.name,
        createdAt: f.created_at,
        updatedAt: f.updated_at,
    }
}

function mapSavedRequest(r: models.domain.SavedRequest): SavedRequest {
    return {
        id: r.id,
        collectionId: r.collection_id,
        folderId: r.folder_id ?? null,
        name: r.name,
        method: r.method,
        url: r.url,
        body: r.body,
        headers: r.headers,
        params: r.params,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
    }
}

export const useCollectionsStore = create<CollectionsStore>((set,get) => ({
    collections: [],
    folders: [],
    requests: [],

    expandedCollectionIds: new Set<string>(),
    expandedFolderIds: new Set<string>(),
    selectedCollectionId: null,

    loadWorkspace: async () => {
        try {
            const raw = await api.getCollections()
            const collections = Array.isArray(raw) ? raw.map(mapCollection) : []

            const allFolders: Folder[] = []
            const allRequests: SavedRequest[] = []

            for(const c of collections){
                const [rawFolders, rawRequests] = await Promise.all([
                    api.getFolders(c.id),
                    api.getSavedRequests(c.id)])

                allFolders.push(...(Array.isArray(rawFolders) ? rawFolders.map(mapFolder) : []))
                allRequests.push(...(Array.isArray(rawRequests) ? rawRequests.map(mapSavedRequest) : []))
            }

            set({collections: collections, folders: allFolders, requests: allRequests})

        } catch (error) {
            console.error("Failed to load collections:", error)
        }
    },

    loadCollectionData: async (collectionId: string) => {
        try {
            const[rawFolders, rawRequests] = await Promise.all([
                api.getFolders(collectionId),
                api.getSavedRequests(collectionId),
            ])
        } catch (error) {
            console.error("Failed to load collection data:", error)
        }
    },

    // collection CRUD

    createCollection: async (name: string) => {
        const now = Date.now()
        const id = crypto.randomUUID()

        const c = new models.domain.Collection({
            id,
            name,
            created_at: now,
            updated_at: now
        })

        try {
            await api.createCollection(c)
            set((state) => ({collections: [...state.collections, mapCollection(c)]}))
        } catch (error) {
            console.error("failed to create collecion", error)
        }
    },
    renameCollection: async (id: string, name: string) => {
        try {
            await api.updateCollection(id, name)
            set((state) => ({collections: state.collections.map((c) => c.id === id ? {...c, name, updatedAt: Date.now()} : c)}))

        } catch (error) {
            console.error("Failed to rename collection:", error)
        }
    },
    deleteCollection: async (id: string) => {
        try {
            await api.deleteCollection(id)
            set((state) => ({
                collections: state.collections.filter((c) => c.id !== id),
                folders: state.folders.filter((f) => f.collectionId !== id),
                requests: state.requests.filter((r) => r.collectionId !== id),
                selectedCollectionId:
                    state.selectedCollectionId === id ? null : state.selectedCollectionId,
            }))
        } catch (error) {
            console.error("Failed to delete collection:", error)
        }
    },

    // folders crud
    createFolder: async (collectionId: string, parentFolderId: string | null, name: string) => {
        const now = Date.now()
        const id = crypto.randomUUID()

        const f = new models.domain.Folder({
            id,
            collection_id: collectionId,
            parent_folder_id: parentFolderId ?? undefined,
            name,
            created_at: now,
            updated_at: now,
        })

        try {
            await api.createFolder(f)
            set((state) => ({
                folders: [...state.folders, mapFolder(f)],
            }))
        } catch (error) {
            console.error("Failed to create folder:", error)
        }
    },

    renameFolder: async (id: string, name: string) => {
        try {
            await api.renameFolder(id, name)
            set((state) => ({
                folders: state.folders.map((f) =>
                    f.id === id ? { ...f, name, updatedAt: Date.now() } : f
                ),
            }))
        } catch (error) {
            console.error("Failed to rename folder:", error)
        }
    },

    deleteFolder: async (id: string) => {
        try {
            await api.deleteFolder(id)
            // Remove this folder and all children recursively
            const allFolderIds = new Set<string>()

            const collectChildren = (parentId: string) => {
                allFolderIds.add(parentId)
                get()
                    .folders.filter((f) => f.parentFolderId === parentId)
                    .forEach((f) => collectChildren(f.id))
            }
            collectChildren(id)

            set((state) => ({
                folders: state.folders.filter((f) => !allFolderIds.has(f.id)),
                requests: state.requests.filter((r) => !r.folderId || !allFolderIds.has(r.folderId)),
            }))
        } catch (error) {
            console.error("Failed to delete folder:", error)
        }
    },

    moveFolder: async (id: string, collectionId: string, parentFolderId: string | null) => {
        try {
            await api.MoveFolder(id, collectionId, parentFolderId)
            set((state) => ({
                folders: state.folders.map((f) =>
                    f.id === id ? { ...f, collectionId, parentFolderId, updatedAt: Date.now() } : f
                ),
            }))
        } catch (error) {
            console.error("Failed to move folder:", error)
        }
    },

    // saved request CRUD
    saveRequest: async (collectionId: string, folderId: string | null, name: string, draft: RequestDraft) => {
        const now = Date.now()
        const id = crypto.randomUUID()

        const finalName = name.trim() || draft.url.trim() || "Untitled Request"

        const r = new models.domain.SavedRequest({
            id,
            collection_id: collectionId,
            folder_id: folderId ?? undefined,
            name: finalName,
            method: draft.method,
            url: draft.url,
            body: draft.body,
            headers: JSON.stringify(draft.headers),
            params: JSON.stringify(draft.params),
            created_at: now,
            updated_at: now,
        })

        try {
            await api.saveRequest(r)
            set((state) => ({
                requests: [...state.requests, mapSavedRequest(r)],
            }))
        } catch (error) {
            console.error("Failed to save request:", error)
        }
    },

    deleteRequest: async (id: string) => {
        try {
            await api.deleteSavedRequest(id)
            set((state) => ({
                requests: state.requests.filter((r) => r.id !== id),
            }))
        } catch (error) {
            console.error("Failed to delete request:", error)
        }
    },

    moveRequest: async (id: string, collectionId: string, folderId: string | null) => {
        const req = get().requests.find((r) => r.id === id)
        if (!req) return

        const now = Date.now()
        const r = new models.domain.SavedRequest({
            id,
            collection_id: collectionId,
            folder_id: folderId ?? undefined,
            name: req.name,
            method: req.method,
            url: req.url,
            body: req.body,
            headers: req.headers,
            params: req.params,
            created_at: req.createdAt,
            updated_at: now,
        })

        try {
            await api.saveRequest(r)
            set((state) => ({
                requests: state.requests.map((item) =>
                    item.id === id ? { ...item, collectionId, folderId, updatedAt: now } : item
                ),
            }))
        } catch (error) {
            console.error("Failed to move request:", error)
        }
    },

    // UI state
    toggleCollection: (id: string) => {
        set((state) => {
            const next = new Set(state.expandedCollectionIds)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return { expandedCollectionIds: next, selectedCollectionId: id }
        })
    },

    toggleFolder: (id: string) => {
        set((state) => {
            const next = new Set(state.expandedFolderIds)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return { expandedFolderIds: next }
        })
    },

    getCollectionFolders: (collectionId: string) => get().folders.filter((f) => f.collectionId === collectionId),
    getRootFolders: (collectionId: string) => get().folders.filter((f) => f.parentFolderId === null && f.collectionId === collectionId),
    getChildFolders: (parentFolderId: string) => get().folders.filter((f) => f.parentFolderId === parentFolderId),
    getFolderRequests: (folderId: string) => get().requests.filter((r) => r.folderId === folderId),
    getRootRequests: (collectionId: string) => get().requests.filter((r) => r.folderId === null && r.collectionId === collectionId)    


}))