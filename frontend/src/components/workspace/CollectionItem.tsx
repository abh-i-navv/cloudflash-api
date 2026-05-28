import { Collection, useCollectionsStore } from "@/store/CollectionsStore";
import { ChevronRight } from "lucide-react";
import React, { useState } from "react";

function CollectionItem({collection} : {collection: Collection}) {
    const [renaming, setRenaming] = useState(false)
    const [creatingFolder, setCreatingFolder] = useState(false)
    const [isDragOver, setIsDragOver] = useState(false)

    const loadWorkspace = useCollectionsStore((state) => state.loadWorkspace)

    const folders = useCollectionsStore((state) => state.folders)
    const requests = useCollectionsStore((state) => state.requests)
    const expandedCollectionIds = useCollectionsStore((state) => state.expandedCollectionIds)

    const toggleCollection = useCollectionsStore((state) => state.toggleCollection)
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

            {/* Collection row */}
            <div onClick={handleToggle}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`group flex items-center gap-1.5 py-2 px-2 rounded-md
                            cursor-pointer transition-all duration-150 ${
                                "bg-blue-500/20 border border-dashed border-blue-500/80"
                            } : "hover:bg-zinc-800/70 border border-transparent`}
            >
                <ChevronRight 
                    size={14}
                    className={`shrink-0 text-zinc-400 transition-transform duration-200
                        ${isExpanded ?  "rotate-90" : ""}`}
                />
                    

            </div>


        </div>
    )
}