import { DeleteHistoryItem, GetHistory, SendRequest } from "../../wailsjs/go/main/App"
import * as models from "../../wailsjs/go/models"

export const api = {
    sendRequest: async (req: models.main.APIRequest) => {
        return await SendRequest(req)
    },

    getHistory: async () => {
        return await GetHistory()
    },

    deleteHistoryItem: async (id: number) => {
        return await DeleteHistoryItem(id)
    }
}