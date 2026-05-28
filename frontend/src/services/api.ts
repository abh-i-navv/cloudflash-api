import { Collection, Folder, SavedRequest } from "@/store/CollectionsStore"
import { CreateCollection, CreateFolder, DeleteCollection, DeleteFolder, DeleteHistoryItem, DeleteSavedRequest, GetCollections, GetFolders, GetHistory, GetSavedRequests, GetTabs, MoveFolder, RenameFolder, SaveRequest, SaveTabs, SendRequest, UpdateCollection } from "../../wailsjs/go/app/App"
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

    // Collections

    createCollection: async (c: models.domain.Collection) => {
        return await (CreateCollection(c))
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

    // Folders
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

    MoveFolder: async (id: string, colletionId: string, parentFolderId: string | null) => {
        return await MoveFolder(id, colletionId, parentFolderId ?? undefined)
    },

    // Saved Request
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
