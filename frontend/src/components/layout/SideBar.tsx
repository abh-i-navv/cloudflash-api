import { Button } from "../ui/button"
import React, { useCallback, useEffect } from "react"
import * as models from "../../../wailsjs/go/models"
import { Trash2 } from "lucide-react"
import { EventsOn } from "../../../wailsjs/runtime/runtime"
import { useShallow } from "zustand/react/shallow"
import { useHistoryStore } from "@/store/historyStore"
import { getDomain, getPathname } from "@/lib/utils"
import { api } from "@/services/api"
import { useTabsStore } from "@/store/tabsStore"
import CollectionsPanel from "../workspace/CollectionsPanel"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const HistoryCard = React.memo(function HistoryCard({
  item,
  onLoad,
  onDelete,
}: {
  item: models.domain.HistoryItem
  onLoad: (item: models.domain.HistoryItem) => void
  onDelete: (e: React.MouseEvent, id: number) => void
}) {
  return (
    <div
      onClick={() => onLoad(item)}
      className="group rounded-md border border-zinc-800 bg-zinc-900 px-3 py-3 cursor-pointer transition-colors hover:bg-zinc-800"
    >
      <div className="flex items-center gap-2">
        <div className="text-sm font-semibold text-green-400">
          {item.method}
        </div>

        <div className="flex-1 break-all text-zinc-300 text-sm">
          {getPathname(item.url)}
        </div>
      </div>

      <div className="flex justify-between">
        <div className="mt-1 break-all text-xs text-zinc-500">
          {getDomain(item.url)}
        </div>

        <div>
          <Button
            onClick={(e: any) => onDelete(e, item.id)}
            className="opacity-0 transition-opacity group-hover:opacity-100 text-red-600"
            variant="destructive"
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </div>
  )
})

export default function SideBar() {
  const createTab = useTabsStore((state) => state.createTab)

  const { history, setHistory } = useHistoryStore(
    useShallow((state) => ({
      history: state.history,
      setHistory: state.setHistory,
    }))
  )

  const refreshHistory = useHistoryStore((state) => state.refreshHistory)

  const loadHistoryItem = useCallback(
    (item: models.domain.HistoryItem) => {
      createTab({
        method: item.method,
        url: item.url,
        body: item.body,
      })
    },
    [createTab]
  )

  const deleteHistoryItemDB = useHistoryStore(
    (state) => state.deleteHistoryItemDB
  )

  const deleteHandler = (e: any, id: number) => {
    e.stopPropagation()
    deleteHistoryItemDB(id)
  }

  const handleNewRequest = useCallback(() => {
    createTab()
  }, [createTab])

  useEffect(() => {
    const unsubscribe = EventsOn("history_updated", async () => {
      const updatedHistory = await api.getHistory()

      setHistory(Array.isArray(updatedHistory) ? updatedHistory : [])
    })

    refreshHistory()

    return () => unsubscribe()
  }, [refreshHistory, setHistory])

  return (
    <aside className="flex h-full w-[20%] min-w-[180px] max-w-[260px] shrink-0 flex-col overflow-hidden border-r border-zinc-800 bg-zinc-900">
      
      {/* Sidebar Header */}
      <div className="h-14 border-b border-zinc-800 flex items-center px-4">
        <h1 className="text-lg font-semibold">CloudFlash</h1>
      </div>

      {/* Sidebar Content */}
      <div className="p-4 overflow-hidden space-y-3 flex-1 flex flex-col">
        
        <Button className="w-full shrink-0" onClick={handleNewRequest}>
          + New Request
        </Button>

        <Tabs
          defaultValue="history"
          className="flex-1 flex flex-col min-h-0"
        >
          <TabsList className="w-full border border-zinc-800 bg-zinc-950">
            <TabsTrigger
              value="history"
              className="flex-1 data-[state=active]:bg-zinc-700"
            >
              History
            </TabsTrigger>

            <TabsTrigger
              value="collections"
              className="flex-1 data-[state=active]:bg-zinc-700"
            >
              Collections
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="history"
            className="flex-1 mt-3 min-h-0 overflow-hidden"
          >
            <div className="space-y-2 h-full overflow-y-auto custom-scrollbar pr-1">
              {history.length > 0 ? (
                history.map((item) => (
                  <HistoryCard
                    key={item.id}
                    item={item}
                    onLoad={loadHistoryItem}
                    onDelete={deleteHandler}
                  />
                ))
              ) : (
                <div className="text-center text-xs text-zinc-500 py-8">
                  No request history yet
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent
            value="collections"
            className="flex-1 mt-3 min-h-0 overflow-hidden"
          >
            <CollectionsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  )
}