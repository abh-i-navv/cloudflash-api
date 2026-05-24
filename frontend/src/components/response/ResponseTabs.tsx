import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import ResponseViewer from "./ResponseViewer"
import ResponseHeaders from "./ResponseHeaders"
import { Button } from "../ui/button"
import { Copy } from "lucide-react"
import { useResponseStore } from "@/store/responseStore"
import { useState } from "react"
import { toast } from "sonner"

export default function ResponseTabs() {

  const responseBody = useResponseStore((state) => state.responseBody)
  const responseHeaders = useResponseStore((state) => state.responseHeaders)

  const [activeTab, setActiveTab] = useState("body")

  const copyToClipboard = async () => {
    if (activeTab === "body") {
      await navigator.clipboard.writeText(responseBody)
      toast("Response copied to the clipboard", { position: "bottom-right", className: "!bg-emerald-700 !text-white !border-emerald-600", duration: 800 })
    }
    else if (activeTab === "headers") {
      await navigator.clipboard.writeText(JSON.stringify(responseHeaders))
      toast("Headers copied to the clipboard", { position: "bottom-right", className: "!bg-emerald-700 !text-white !border-emerald-600", duration: 800 })
    }
  }


  return (
    <Tabs
      defaultValue="body"
      className="h-full flex flex-col min-h-0"
    >
      <div className="flex items-center justify-between">

        <TabsList className="w-fit border border-zinc-800 bg-zinc-950">
          <TabsTrigger value="body" onClick={() => setActiveTab("body")} className={`${activeTab == "body" ? "bg-zinc-700" : ""}`}>
            Body
          </TabsTrigger>

          <TabsTrigger value="headers" onClick={() => setActiveTab("headers")} className={`${activeTab == "headers" ? "bg-zinc-700" : ""}`}>
            Headers
          </TabsTrigger>
        </TabsList>
        <Button variant={"ghost"} size={"icon"} className="text-zinc-400 hover:text-white items-right" onClick={copyToClipboard}><Copy className="h-4 w-4" /> </Button>

      </div>

      <TabsContent
        value="body"
        className="flex-1 mt-4 min-h-0"
      >
        <ResponseViewer />
      </TabsContent>

      <TabsContent
        value="headers"
        className="flex-1 mt-4"
      >
        <ResponseHeaders />
      </TabsContent>
    </Tabs>
  )
}