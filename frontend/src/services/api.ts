import { DeleteHistoryItem, GetHistory, GetTabs, SaveTabs, SendRequest } from "../../wailsjs/go/app/App"
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
    }
}
