import { useActiveTabId, useTabs } from "@/store/selectors/tabSelectors"
import { useTabsStore } from "@/store/tabsStore"
import { Plus, X } from "lucide-react"
import { useState } from "react"

type PointerStart = {
    id: string
    x: number
    y: number
}

export default function RequestMultiTabs() {
    const tabs = useTabs()

    const activeTabId = useActiveTabId()
    const createTab = useTabsStore((state) => state.createTab)

    const closeTab = useTabsStore((state) => state.closeTab)

    const setActiveTab = useTabsStore((state) => state.setActiveTab)
    const reorderTabs = useTabsStore((state) => state.reorderTabs)
    const [draggedTabId, setDraggedTabId] = useState<string | null>(null)
    const [dropTargetId, setDropTargetId] = useState<string | null>(null)
    const [pointerStart, setPointerStart] = useState<PointerStart | null>(null)

    function resetDragState() {
        setPointerStart(null)
        setDraggedTabId(null)
        setDropTargetId(null)
    }

    function handlePointerDown(e: React.PointerEvent<HTMLDivElement>, tabId: string) {
        if (e.button !== 0) return

        e.currentTarget.setPointerCapture(e.pointerId)
        setPointerStart({ id: tabId, x: e.clientX, y: e.clientY })
    }

    function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
        if (!pointerStart) return

        const distance = Math.hypot(e.clientX - pointerStart.x, e.clientY - pointerStart.y)
        const isDragging = draggedTabId !== null || distance > 4

        if (!isDragging) return

        setDraggedTabId(pointerStart.id)

        const element = document.elementFromPoint(e.clientX, e.clientY)
        const target = element?.closest<HTMLElement>("[data-tab-id]")
        const targetId = target?.dataset.tabId

        if (!targetId || targetId === pointerStart.id) {
            setDropTargetId(null)
            return
        }

        setDropTargetId(targetId)
        reorderTabs(pointerStart.id, targetId)
    }

    function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
        if (!pointerStart) return

        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId)
        }

        setActiveTab(pointerStart.id)
        resetDragState()
    }

    function handlePointerCancel() {
        resetDragState()
    }

    return (
        <div className="flex items-center border-b border-zinc-800 bg-zinc-950 overflow-x-auto custom-scrollbar">
            {tabs.map((tab) => {
                const isActive = tab.id === activeTabId

                return (
                    <div
                        key={tab.id}
                        data-tab-id={tab.id}
                        onPointerDown={(e) => handlePointerDown(e, tab.id)}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerCancel}
                        className={`flex items-center gap-2 pl-4 pr-1 py-2 border-r rounded-r-md border-zinc-800
                            cursor-pointer select-none touch-none min-w-[140px] max-w-[220px] group
                            transition-[transform,opacity,background-color,box-shadow,border-color] duration-200 ease-out
                            hover:-translate-y-0.5 ${isActive ? "bg-zinc-900 text-white" : "bg-zinc-950 text-zinc-400 hover:bg-zinc-900/50"
                            } ${draggedTabId === tab.id ? "scale-95 opacity-40 shadow-2xl" : ""
                            } ${dropTargetId === tab.id && draggedTabId !== tab.id ? "scale-[1.02] border-zinc-500 shadow-lg shadow-black/20" : ""
                            }`}>
                        <span className="truncate flex-1 text-sm">{tab.title}</span>
                        {
                            tab.dirty && (
                                <div className="w-2 h-2 rounded-full bg-orange-400" />
                            )
                        }
                        <button onClick={(e) => {
                            e.stopPropagation()
                            closeTab(tab.id)
                        }}
                            onPointerDown={(e) => e.stopPropagation()}
                            className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )
            })}
            <button
                onClick={() => createTab()}
                className="
                    px-3 py-2
                    text-zinc-400
                    hover:text-white
                    hover:bg-zinc-900
                    transition
                "
            >
                <Plus size={16} />
            </button>
        </div>
    )
}
