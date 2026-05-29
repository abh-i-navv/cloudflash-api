import { useCollectionsStore } from "@/store/CollectionsStore";
import { FolderPlus, Library, Search } from "lucide-react";
import { useEffect, useState } from "react";
import InlineRenameInput from "./InlineRenameInput";
import CollectionItem from "./CollectionItem";

export default function CollectionsPanel() {
    const collections = useCollectionsStore((state) => state.collections)
    const createCollection = useCollectionsStore((state) => state.createCollection)
    const loadWorkspace = useCollectionsStore((state) => state.loadWorkspace)

    const [creatingCollection, setCreatingCollection] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        loadWorkspace()
    },[loadWorkspace])

    function handleCreateCollection(name: string) {
        createCollection(name)
        setCreatingCollection(false)
    }

    const filteredCollections = collections.filter((c) => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()))

    return (
        <div className="flex-1 flex flex-col min-h-0 h-full">
            {/* Action bar */}

            <div className="flex items-center gap-2 mb-3 shrink-0">
                {/* Search */}
                <div className="relative flex-1 flex items-center">
                    <Search size={14} className="flex items-center absolute left-2.5 top-1/2 text-zinc-500"/>
                    <input 
                        type="text"
                        placeholder="Search collections..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-800/50 text-xs text-white placeholder-zinc-500 rounded-md
                                   pl-8 pr-2 py-1.5 border border-zinc-800/80 outline-none
                                   focus:border-blue-500/50 focus:bg-zinc-800 transition-all"
                    />
                </div>

                {/* New collection */}
                <button 
                    onClick={() => setCreatingCollection(true)}
                    className="p-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white
                               border border-zinc-800 transition-colors shrink-0"
                    title="New Collection"
                    >
                        <FolderPlus size={15}/>
                </button>
            </div>

            {/* Collection creation input */}

            {creatingCollection && (
                <div className="mb-2 p-1 bg-zinc-800/30 rounded border border-zinc-800/60 shrink-0"> 
                    <InlineRenameInput initialValue="New Collection" onSave={handleCreateCollection} onCancel={() => setCreatingCollection(false)}/>
                </div>
            )}

            {/* Collection list */}

            <div className="flex-1 min-h-0 overflow-auto custom-scrollbar space-y-1">
                {filteredCollections.map((c) => (
                    <CollectionItem key={c.id} collection={c}/>
                ))}

                {(filteredCollections.length === 0 && !creatingCollection && (
                    <div className="flex flex-col items-center justify-center py-8 text-zinc-500 gap-1.5">
                        <Library size={24} className="opacity-40" />
                        <span className="text-xs">
                            {searchQuery ? "No matching collections" : "Empty Collections"}
                        </span>
                        {!searchQuery && (
                            <button 
                                onClick={() => setCreatingCollection(true)}
                                className="text-[11px] text-blue-400 hover:underline mt-1">
                                    Create a collection
                            </button>
                        )}
                    </div>
                ))}

            </div>

        </div>
    )

}