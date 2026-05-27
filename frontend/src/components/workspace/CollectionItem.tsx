import React, { useState } from "react"
import { ChevronRight, Folder, FolderOpen, Trash2, Pencil, FolderPlus } from "lucide-react"
import { Collection, useCollectionsStore } from "@/store/CollectionsStore"
import FolderItem from "./FolderItem"
import SavedRequestItem from "./SavedRequestItem"
import InlineRenameInput from "./InlineRenameInput"

function CollectionItem({ collection }: { collection: Collection }) {
    const [renaming, setRenaming] = useState(false)
    const [creatingFolder, setCreatingFolder] = useState(false)
    const [isDragOver, setIsDragOver] = useState(false)

    const folders = useCollectionsStore((s) => s.folders)
    const requests = useCollectionsStore((s) => s.requests)
    const expandedCollectionIds = useCollectionsStore((s) => s.expandedCollectionIds)

    const toggleCollection = useCollectionsStore((s) => s.toggleCollection)
    const renameCollection = useCollectionsStore((s) => s.renameCollection)
    const deleteCollection = useCollectionsStore((s) => s.deleteCollection)
    const createFolder = useCollectionsStore((s) => s.createFolder)
    const moveFolder = useCollectionsStore((s) => s.moveFolder)
    const moveRequest = useCollectionsStore((s) => s.moveRequest)

    const isExpanded = expandedCollectionIds.has(collection.id)
    const rootFolders = React.useMemo(() => folders.filter((f) => f.collectionId === collection.id && !f.parentFolderId), [folders, collection.id])
    const rootRequests = React.useMemo(() => requests.filter((r) => r.collectionId === collection.id && !r.folderId), [requests, collection.id])

    function handleToggle() {
        toggleCollection(collection.id)
    }

    function handleRename(name: string) {
        renameCollection(collection.id, name)
        setRenaming(false)
    }

    function handleDelete(e: React.MouseEvent) {
        e.stopPropagation()
        if (confirm(`Are you sure you want to delete collection "${collection.name}"?`)) {
            deleteCollection(collection.id)
        }
    }

    function handleAddFolder(e: React.MouseEvent) {
        e.stopPropagation()
        if (!isExpanded) toggleCollection(collection.id)
        setCreatingFolder(true)
    }

    function handleCreateFolder(name: string) {
        createFolder(collection.id, null, name)
        setCreatingFolder(false)
    }

    // Drag and Drop (Collection drop target)
    function handleDragOver(e: React.DragEvent) {
        e.preventDefault()
        e.stopPropagation()
    }

    // On drag enter
    function handleDragEnter(e: React.DragEvent) {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(true)
    }

    // On drag leave
    function handleDragLeave(e: React.DragEvent) {
        e.stopPropagation()
        setIsDragOver(false)
    }

    // On Drop (Rearranging items)
    function handleDrop(e: React.DragEvent) {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(false)

        try {
            const data = JSON.parse(e.dataTransfer.getData("text/plain"))
            if (!data || !data.id) return

            if (data.type === "request") {
                moveRequest(data.id, collection.id, null)
            } else if (data.type === "folder") {
                moveFolder(data.id, collection.id, null)
            }
        } catch (err) {
            console.error("Drop failed:", err)
        }
    }

    return (
        <div className="border-b border-zinc-800/40 pb-1">
            {/* Collection Row */}
            <div
                onClick={handleToggle}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`group flex items-center gap-1.5 py-2 px-2 rounded-md
                           cursor-pointer transition-all duration-150 ${
                               isDragOver
                                   ? "bg-blue-500/20 border border-dashed border-blue-500/80"
                                   : "hover:bg-zinc-800/70 border border-transparent"
                           }`}
            >
                <ChevronRight
                    size={14}
                    className={`shrink-0 text-zinc-400 transition-transform duration-200
                               ${isExpanded ? "rotate-90" : ""}`}
                />
                
                {isExpanded
                    ? <FolderOpen size={15} className="shrink-0 text-blue-400" />
                    : <Folder size={15} className="shrink-0 text-blue-400/80" />
                }

                {renaming ? (
                    <InlineRenameInput
                        initialValue={collection.name}
                        onSave={handleRename}
                        onCancel={() => setRenaming(false)}
                    />
                ) : (
                    <span className="text-sm font-semibold text-zinc-200 truncate flex-1 ml-0.5">
                        {collection.name}
                    </span>
                )}

                {/* Actions */}
                {!renaming && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                            onClick={handleAddFolder}
                            className="text-zinc-500 hover:text-white p-0.5"
                            title="Add Folder"
                        >
                            <FolderPlus size={13} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setRenaming(true) }}
                            className="text-zinc-500 hover:text-white p-0.5"
                            title="Rename Collection"
                        >
                            <Pencil size={13} />
                        </button>
                        <button
                            onClick={handleDelete}
                            className="text-zinc-500 hover:text-red-400 p-0.5"
                            title="Delete Collection"
                        >
                            <Trash2 size={13} />
                        </button>
                    </div>
                )}
            </div>

            {/* Sub-items */}
            {isExpanded && (
                <div className="pl-2">
                    {creatingFolder && (
                        <div className="pl-6 py-1">
                            <InlineRenameInput
                                initialValue="New Folder"
                                onSave={handleCreateFolder}
                                onCancel={() => setCreatingFolder(false)}
                            />
                        </div>
                    )}

                    {rootFolders.map((folder) => (
                        <FolderItem key={folder.id} folder={folder} depth={1} />
                    ))}

                    {rootRequests.map((req) => (
                        <SavedRequestItem key={req.id} request={req} depth={1} />
                    ))}

                    {rootFolders.length === 0 && rootRequests.length === 0 && !creatingFolder && (
                        <div className="pl-6 text-xs text-zinc-600 py-1.5 italic">
                            Empty Collection
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default React.memo(CollectionItem)
