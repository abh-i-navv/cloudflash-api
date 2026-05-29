import React, { useState, useEffect } from "react"
import { X, FolderPlus } from "lucide-react"
import { useCollectionsStore, Folder } from "@/store/CollectionsStore"
import { RequestDraft } from "@/store/tabsStore"
import { toast } from "sonner"

type SaveRequestModalProps = {
    isOpen: boolean
    onClose: () => void
    draft: RequestDraft | undefined
}

type FolderOption = {
    id: string
    name: string
    depth: number
}

function getFolderOptions(
    folders: Folder[],
    parentId: string | null = null,
    depth = 0
): FolderOption[] {
    const list: FolderOption[] = []
    const levelFolders = folders.filter((f) => f.parentFolderId === parentId)
    for (const f of levelFolders) {
        list.push({ id: f.id, name: f.name, depth })
        list.push(...getFolderOptions(folders, f.id, depth + 1))
    }
    return list
}

export default function SaveRequestModal({ isOpen, onClose, draft }: SaveRequestModalProps) {
    const collections = useCollectionsStore((s) => s.collections)
    const folders = useCollectionsStore((s) => s.folders)
    const saveRequest = useCollectionsStore((s) => s.saveRequest)
    const createCollection = useCollectionsStore((s) => s.createCollection)

    const [name, setName] = useState("")
    const [selectedCollectionId, setSelectedCollectionId] = useState("")
    const [selectedFolderId, setSelectedFolderId] = useState("")
    const [creatingNewCollection, setCreatingNewCollection] = useState(false)
    const [newCollectionName, setNewCollectionName] = useState("")

    // Initialize/reset states when modal opens
    useEffect(() => {
        if (isOpen && draft) {
            // Default name from URL or Untitled
            const defaultName = draft.url.trim()
                ? draft.url.replace(/https?:\/\//, "")
                : "Untitled Request"
            setName(defaultName)

            // Select first collection if exists
            if (collections.length > 0) {
                setSelectedCollectionId(collections[0].id)
                setSelectedFolderId("")
            } else {
                setSelectedCollectionId("")
                setSelectedFolderId("")
            }
            setCreatingNewCollection(false)
            setNewCollectionName("")
        }
    }, [isOpen, draft, collections])

    if (!isOpen || !draft) return null

    // Get folders for selected collection
    const collectionFolders = folders.filter((f) => f.collectionId === selectedCollectionId)
    const folderOptions = getFolderOptions(collectionFolders, null, 0)

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        if (!draft) return

        let collectionId = selectedCollectionId

        // Handle inline collection creation
        if (creatingNewCollection) {
            const cleanName = newCollectionName.trim()
            if (!cleanName) {
                toast.error("Please enter a collection name")
                return
            }
            // Generate UUID so we can save immediately
            const newId = crypto.randomUUID()
            try {
                await createCollection(cleanName)
                // Note: sincezustand state updates, we want to find the newly created collection or just use the generated ID
                // In CollectionsStore, createCollection uses crypto.randomUUID() inline, so we cannot easily pass or get it
                // To keep it simple, let's create it first, then search the store collections
                // Or better, let the user create collection in the sidebar as standard, 
                // but if we do it here, let's wait for state to update
                
                toast(`Created collection "${cleanName}"`, { position: "bottom-right", className: "!bg-emerald-700 !text-white !border-emerald-600", duration: 1000 })
            } catch (err) {
                toast.error("Failed to create collection")
                return
            }
            // Wait, since we don't return the ID, let's fetch the latest collection from the updated list
            // Or let's just use the collections list. To make it extremely reliable, let's support creating collection inline
            // using the collections update.
        }

        if (!collectionId && !creatingNewCollection) {
            toast.error("Please select or create a collection")
            return
        }

        // If we created a new collection, we'll try to find its ID in the updated list
        if (creatingNewCollection) {
            // Find the collection matching the name we just created
            const match = useCollectionsStore.getState().collections.find(
                (c) => c.name === newCollectionName.trim()
            )
            if (match) {
                collectionId = match.id
            } else {
                // Fallback: use the last added collection
                const cols = useCollectionsStore.getState().collections
                if (cols.length > 0) {
                    collectionId = cols[cols.length - 1].id
                }
            }
        }

        try {
            await saveRequest(collectionId, selectedFolderId || null, name, draft)
            
            toast("Request saved to collection!", { position: "bottom-right", className: "!bg-emerald-700 !text-white !border-emerald-600", duration: 1000 })
            
            onClose()
        } catch (err) {
            toast.error("Failed to save request")
        }
    }

    async function handleCreateCollectionInline() {
        const cleanName = newCollectionName.trim()
        if (!cleanName) return

        await createCollection(cleanName)
        setCreatingNewCollection(false)
        setNewCollectionName("")
        // Selected collection will auto-update via useEffect or we can select it manually
        setTimeout(() => {
            const cols = useCollectionsStore.getState().collections
            const newlyCreated = cols.find(c => c.name === cleanName)
            if (newlyCreated) {
                setSelectedCollectionId(newlyCreated.id)
            }
        }, 50)
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            />

            {/* Modal Box */}
            <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full shadow-2xl overflow-hidden p-5 flex flex-col gap-4 animate-in fade-in-50 zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                    <h3 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                        <FolderPlus size={18} className="text-blue-400" />
                        <span>Save Request to Collection</span>
                    </h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white transition">
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSave} className="space-y-4">
                    
                    {/* Name Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                            Request Name
                        </label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700/80 rounded-md px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors"
                            placeholder="e.g. Get User Profile"
                        />
                    </div>

                    {/* Collection Selection */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                Collection
                            </label>
                            <button
                                type="button"
                                onClick={() => setCreatingNewCollection(!creatingNewCollection)}
                                className="text-xs text-blue-400 hover:underline"
                            >
                                {creatingNewCollection ? "Select existing" : "+ Create new"}
                            </button>
                        </div>

                        {creatingNewCollection ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newCollectionName}
                                    onChange={(e) => setNewCollectionName(e.target.value)}
                                    className="flex-1 bg-zinc-800 border border-zinc-700/80 rounded-md px-3 py-1.5 text-sm text-white outline-none focus:border-blue-500 transition-colors"
                                    placeholder="New collection name"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={handleCreateCollectionInline}
                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold transition"
                                >
                                    Create
                                </button>
                            </div>
                        ) : (
                            <select
                                value={selectedCollectionId}
                                onChange={(e) => {
                                    setSelectedCollectionId(e.target.value)
                                    setSelectedFolderId("")
                                }}
                                className="w-full bg-zinc-800 border border-zinc-700/80 rounded-md px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors"
                            >
                                {collections.length === 0 ? (
                                    <option value="" disabled>No collections available. Create one!</option>
                                ) : (
                                    collections.map((col) => (
                                        <option key={col.id} value={col.id}>
                                            {col.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        )}
                    </div>

                    {/* Folder Selection (Optional) */}
                    {!creatingNewCollection && collections.length > 0 && (
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                Folder (Optional)
                            </label>
                            <select
                                value={selectedFolderId}
                                onChange={(e) => setSelectedFolderId(e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-700/80 rounded-md px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors"
                            >
                                <option value="">Root level (No folder)</option>
                                {folderOptions.map((opt) => (
                                    <option key={opt.id} value={opt.id}>
                                        {"\u00A0\u00A0".repeat(opt.depth) + "↳ " + opt.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800/80">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-transparent hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white rounded-md text-sm transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!creatingNewCollection && collections.length === 0}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white rounded-md text-sm font-semibold transition"
                        >
                            Save Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
