import { useActiveTabId, useTabs } from "@/store/selectors/tabSelectors"
import { useTabsStore } from "@/store/tabsStore"
import { Plus, X } from "lucide-react"

export default function RequestMultiTabs() {
   
    const tabs = useTabs()
    
    const activeTabId = useActiveTabId()
    const createTab = useTabsStore((state) => state.createTab)
    
    const closeTab = useTabsStore((state) => state.closeTab)
    
    const setActiveTab = useTabsStore((state) => state.setActiveTab)

    return (
        <div className="flex items-center border-b border-zinc-800 bg-zinc-950 overflow-x-auto custom-scrollbar">
            {tabs.map((tab) => {
                const isActive = tab.id === activeTabId

                return (
                    <div key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 pl-4 pr-1 py-2 border-r border-zinc-800
                            cursor-pointer min-w-[140px] max-w-[220px] group ${
                                isActive ? "bg-zinc-900 text-white" : "bg-zinc-950 text-zinc-400 hover:bg-zinc-900/50"
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
                        }} className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition">
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
