import { useRequestStore } from "@/store/requestStore";
import MethodSelector from "../request/MethodSelector";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {SendRequest} from "../../../wailsjs/go/main/App"
import * as models from "../../../wailsjs/go/models"
import { Loader } from "lucide-react";

export default function TopBar() {
  const url = useRequestStore((state) => state.url)
  const setUrl = useRequestStore((state) => state.setUrl)

  const method = useRequestStore((state) => state.method)

  const body = useRequestStore((state) => state.body)
  const headers = useRequestStore((state) => state.headers)
  const params = useRequestStore((state) => state.params)

  const setResponseBody = useRequestStore((state) => state.setResponseBody)
  const setResponseStatus = useRequestStore((state) => state.setResponseStatus)
  const setResponseTime = useRequestStore((state) => state.setResponseTime)
  const setResponseSize = useRequestStore((state) => state.setResponseSize)
  const setResponseHeaders = useRequestStore((state) => state.setResponseHeaders)

  const loading = useRequestStore((state) => state.loading)
  const setLoading = useRequestStore((state) => state.setLoading)

  const setError = useRequestStore((state) => state.setError)

  async function handleSend() {
    try {
      setError("")
      setLoading(true)
      const req = new models.main.APIRequest({
        method,
        url,
        body,
        headers,
        params
      })
      
      const res = await SendRequest(req)
  
      setResponseBody(res.body)
      setResponseStatus(res.status)
      setResponseTime(res.time)
      setResponseSize(res.size)
      setResponseHeaders(res.headers)

    } catch (error) {
      setError("failed to send request")

      setResponseStatus(0)
      setResponseBody(String(error))
    }
    finally{
      setLoading(false)
    }
  }
  

  return(
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-800 bg-zinc-900 px-4">
        
        {/* Method Selector */}
          <MethodSelector />

        {/* URL Input */}

        <Input value={url} onChange={(e) => setUrl(e.target.value)} type="text" placeholder="Enter request URL..." className="flex-1 bg-zinc-800 border border-zinc-700 rounded-md hover:bg-zinc-700 px-4 py-2 text-sm outline-none"/>

        {/* Send Button */}
        <Button onClick={handleSend} disabled={loading}>{loading ? <Loader /> : "Send"}</Button>
      </header>
  )
}
