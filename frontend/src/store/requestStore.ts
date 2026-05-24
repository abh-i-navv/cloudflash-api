import { create } from "zustand"
import * as models from "../../wailsjs/go/models"
import { Header, Param, ResponseHeader } from "@/types/global"
import { formatResponseBody } from "@/lib/utils"
import { useResponseStore } from "./responseStore"
import { api } from "@/services/api"

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

    //send request
    sendRequest: () => Promise<void>

    //loading

    loading: boolean
    setLoading: (loading: boolean) => void

    //error
    error: string

    setError: (error: string) => void
}

export const useRequestStore = create<RequestStore>((set, get) => ({
    //request state

    method: "GET",
    url: "",

    body: `{"email": "abc@abc.com"}`,

    headers: [{
        key: "content-type",
        value: "application/json"
    },
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


    //loading

    loading: false,
    setLoading: (loading) => set({ loading }),

    //error
    error: "",
    setError: (error: string) => set({ error }),

    //send request
    sendRequest: async () => {
        const { method, url, body, headers, params } = get()
        const { setResponseBody, setResponseStatus, setResponseTime, setResponseSize, setResponseHeaders } = useResponseStore.getState()

        try {
            set({ error: "", loading: true })
            const req = new models.main.APIRequest({
                method,
                url,
                body,
                headers,
                params
            })

            const res = await api.sendRequest(req)

            setResponseBody(formatResponseBody(res.body))
            setResponseStatus(res.status)
            setResponseTime(res.time)
            setResponseSize(res.size)
            setResponseHeaders(res.headers)

        } catch (error) {
            set({ error: "failed to send request" })

            setResponseStatus(0)
            setResponseBody(String(error))
        }
        finally {
            set({ loading: false })
        }
    }

}))
