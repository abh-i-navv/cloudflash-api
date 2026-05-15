import { useRequestStore } from "@/store/requestStore"
import { Button } from "../ui/button"
import {DeleteHistoryItem, GetHistory} from "../../../wailsjs/go/main/App"
import React, { useEffect } from "react"
import * as models from "../../../wailsjs/go/models"
import {Trash2 } from "lucide-react"
import {EventsOn} from "../../../wailsjs/runtime/runtime"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"
import { Separator } from "../ui/separator"

function getPathname(url: string) {
  try {
    const parsed = new URL(url)

    return parsed.pathname || "/"

  } catch (error) {
    return url
  }
}

function getDomain(url: string){
  try {
    return new URL(url).hostname
  } catch (error) {
    return url
  }
}

export default function SideBar() {
  const setMethod = useRequestStore((state) => state.setMethod)
  const setUrl = useRequestStore((state) => state.setUrl)
  const setBody = useRequestStore((state) => state.setBody)

  const history = useRequestStore((state)=>state.history)
  const setHistory = useRequestStore((state) => state.setHistory)

  const deleteHistoryItem = useRequestStore((state) => state.deleteHistoryItem)

   async function refreshHistory() {
    try {
      const result = await GetHistory()
    
      setHistory(Array.isArray(result) ? result : [])
    
    } catch (error) {
      console.log(error)
      setHistory([])
    }
  }

  function loadHistoryItem(item: models.database.HistoryItem) {
    setMethod(item.method)
    setUrl(item.url)
    setBody(item.body)
  }

  async function deleteHandler(id: number, e: MouseEvent) {
      e.stopPropagation()

      try {
        await DeleteHistoryItem(id)

        deleteHistoryItem(id)
      } catch (error) {
        console.log(error)
      }
  }

  function handleNewRequest () {
    setBody("")
    setMethod("GET")
    setUrl("")
  }

  useEffect(() => {

    const unsubscribe = EventsOn("history_updated", async () => {
      const updatedHistory = await GetHistory()

      setHistory(Array.isArray(updatedHistory) ? updatedHistory : [])
    })

    refreshHistory()

    return () => unsubscribe()
    
  },[])
  
 

  return(
      <aside className="flex h-full w-[20%] min-w-[180px]  max-w-[260px] shrink-0 flex-col overflow-hidden border-r border-zinc-800 bg-zinc-900">
      
      {/* Sidebar Header */}
      <div className="h-14 border-b border-zinc-800 flex items-center px-4">
        <h1 className="text-lg font-semibold">CloudFlash</h1>
      </div>

      {/* Sidebar Content */}
      <div className="p-4 overflow-hidden space-y-2 flex-1 flex flex-col">

      <Button className="w-full shrink-0" onClick={handleNewRequest}>+ New Request</Button>
      <div className="mt-6 space-y-2 flex-1 min-h-0 overflow-y-auto custom-scrollbar">

          {history.map((item) => (
            <div key={item.id} onClick={() => loadHistoryItem(item) } 
              className="group rounded-md border border-zinc-800 bg-zinc-900 px-3 py-3 cursor-pointer transition-colors hover:bg-zinc-800 " > 
              <div className=" flex items-center gap-2 "> 
                <div className=" text-sm font-semibold text-green-400 "> {item.method} </div> 
                <div className="flex-1 break-all text-zinc-300 text-sm"> {getPathname(item.url)} </div> 
                </div> 
                <div className="flex justify-between">
                  <div className="mt-1 break-all text-xs text-zinc-500"> {getDomain(item.url)}</div> 
                  <div>
                    <Button onClick={(e:any) => deleteHandler(item.id, e)} className="opacity-0 transition-opacity group-hover:opacity-100 text-red-600" variant="destructive"><Trash2/></Button>
                  </div>
                </div>
              </div>
              
            ))}
      </div>
      </div>
    </aside>
  )
}
