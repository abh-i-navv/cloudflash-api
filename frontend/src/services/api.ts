import {
    CreateCollection, GetCollections, UpdateCollection, DeleteCollection,
    CreateFolder, GetFolders, RenameFolder, DeleteFolder, MoveFolder,
    SaveRequest, GetSavedRequests, DeleteSavedRequest,
    DeleteHistoryItem, GetHistory, GetTabs, SaveTabs, SendRequest,
} from "../../wailsjs/go/app/App"
import * as models from "../../wailsjs/go/models"

export const api = {
    sendRequest: async (req: models.domain.APIRequest) => {
        return await SendRequest(req)
    },

    getHistory: async () => {
        return await GetHistory()
    },

    deleteHistoryItem: async (id: number) => {
        return await DeleteHistoryItem(id)
    },

    getTabs: async () => {
        return await GetTabs()
    },

    saveTabs: async (tabs: models.domain.Tab[]) => {
        return await SaveTabs(tabs)
    },

    // ── Collections ──────────────────────────────────────

    createCollection: async (c: models.domain.Collection) => {
        return await CreateCollection(c)
    },

    getCollections: async () => {
        return await GetCollections()
    },

    updateCollection: async (id: string, name: string) => {
        return await UpdateCollection(id, name)
    },

    deleteCollection: async (id: string) => {
        return await DeleteCollection(id)
    },

    // ── Folders ──────────────────────────────────────────

    createFolder: async (f: models.domain.Folder) => {
        return await CreateFolder(f)
    },

    getFolders: async (collectionID: string) => {
        return await GetFolders(collectionID)
    },

    renameFolder: async (id: string, name: string) => {
        return await RenameFolder(id, name)
    },

    deleteFolder: async (id: string) => {
        return await DeleteFolder(id)
    },

    moveFolder: async (id: string, collectionID: string, parentFolderID?: string | null) => {
        return await MoveFolder(id, collectionID, parentFolderID ?? undefined)
    },

    // ── Saved Requests ───────────────────────────────────

    saveRequest: async (r: models.domain.SavedRequest) => {
        return await SaveRequest(r)
    },

    getSavedRequests: async (collectionID: string) => {
        return await GetSavedRequests(collectionID)
    },

    deleteSavedRequest: async (id: string) => {
        return await DeleteSavedRequest(id)
    },
}
