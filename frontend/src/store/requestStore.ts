import { create } from "zustand"

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
}

export const useRequestStore = create<RequestStore>((set) => ({
    //request state

    method: "GET",
    url: "",
    
    body: `{
    "email": "abc@abc.com"
    }`,

    headers: [],

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
            message: "success",
            data: {
            id: 12345,
            },
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

}))