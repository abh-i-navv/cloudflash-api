import { create } from "zustand"
import * as models from "../../wailsjs/go/models"
import { api } from "@/services/api"
import { DeleteHistoryItem } from "wailsjs/go/main/App"

type HistoryStore = {
    //history
    history: models.database.HistoryItem[]

    setHistory: (history: models.database.HistoryItem[]) => void

    //inserting history item
    addHistoryItem: (item: models.database.HistoryItem) => void

    //deleting history item from UI
    deleteHistoryItemUI: (id: number) => void

    //delete history item from DB
    deleteHistoryItemDB: (id: number) => Promise<void>

    //refresh history
    refreshHistory: () => Promise<void>

}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
    //history
    history: [],
    setHistory: (history) => set({ history: Array.isArray(history) ? history : [] }),

    //adding history item
    addHistoryItem: (item) => set((state) => (
        {
            history: [...state.history, item]
        }
    )),

    //deleting history item from UI
    deleteHistoryItemUI: (id: number) => set((state) => {
        return { history: state.history.filter((item) => item.id !== id) }
    }),

    //deleting history item from DB
    deleteHistoryItemDB: async (id: number) => {
        try {
            await api.deleteHistoryItem(id)
            get().deleteHistoryItemUI(id)
        } catch (error) {
            console.log(error)
        }
    },

    refreshHistory: async () => {
        try {
            const history = await api.getHistory()
            set({ history: Array.isArray(history) ? history : [] })
        } catch (error) {
            console.log(error)
        }
    }
}))