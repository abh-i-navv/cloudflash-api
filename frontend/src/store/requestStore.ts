import { create } from "zustand"
import * as models from "../../wailsjs/go/models"

type Header = {
    key: string
    value: string
}

type Param = {
    key: string
    value: string
}

type ResponseHeader = {
  key: string
  value: string
}

type RequestStore = {
    //request state
    method: string
    url: string
    body: string

    headers: Header[]
    params: Param[]

    setMethod: (method: string) => void
    setUrl: (url: string) => void
    setBody: (body: string) => void

    setHeaders: (headers: Header[]) => void
    setParams: (params: Param[]) => void

    //response state
    responseBody: string

    responseStatus: number

    responseTime: number

    responseSize: string

    responseHeaders: ResponseHeader[]

    setResponseBody: (body: string) => void

    setResponseStatus: (status: number) => void

    setResponseTime: (time: number) => void

    setResponseSize: (size: string) => void

    setResponseHeaders: (headers: ResponseHeader[]) => void

    //loading

    loading: boolean
    setLoading: (loading: boolean ) => void

    //error
    error: string

    setError: (error: string) => void

    //history
    history: models.database.HistoryItem[]

    setHistory: (history: models.database.HistoryItem[]) => void

    //inserting history item
    addHistoryItem: (item: models.database.HistoryItem) => void

    //deleting history item
    deleteHistoryItem: (id: number) => void
}

export const useRequestStore = create<RequestStore>((set) => ({
    //request state

    method: "GET",
    url: "",
    
    body: `{"email": "abc@abc.com"}`,

    headers: [{key: "content-type",
            value:"application/json"},
            // {key: "Connection", value: "keep-alive"},
        ],

    params: [],

    setMethod: (method) =>
      set({ method }),

    setUrl: (url) =>
      set({ url }),

    setBody: (body) =>
      set({ body }),

    setHeaders: (headers) =>
      set({ headers }),

    setParams: (params) =>
      set({ params }),

    //response state

    responseBody: JSON.stringify(
        {
            message: "Welcome to Cloud Flash API",
        },
        null,
        2
    ),

    responseStatus: 200,

    responseTime: 124,

    responseSize: "1.2KB",

    responseHeaders: [
        {
            key: "content-type",
            value:"application/json",
        },
        {
            key:"server",
            value: "nginx"
        }
    ],

    setResponseBody: (responseBody) =>set({ responseBody }),

    setResponseStatus: (responseStatus) =>set({ responseStatus }),

    setResponseTime: (responseTime) =>set({ responseTime }),

    setResponseSize: (responseSize) =>set({ responseSize }),

    setResponseHeaders: (responseHeaders) =>set({ responseHeaders }),
    
    //loading

    loading:false,
    setLoading: (loading) => set({loading}),

    //error
    error: "",
    setError: (error:string) => set({error}),

    //history
    history: [],
    setHistory: (history) => set({history}),

    //adding history item
    addHistoryItem: (item) => set((state) => (
        {
            history: [...state.history, item]
        }
    )),

    //deleting history item
    deleteHistoryItem: (id: number) => set((state) => ({
        history: state.history.filter((item) => item.id !== id)
    }))
}))
