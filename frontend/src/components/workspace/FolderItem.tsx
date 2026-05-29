import { Folder, useCollectionsStore } from "@/store/CollectionsStore";
import React, { useState } from "react";
import InlineRenameInput from "./InlineRenameInput";
import { ChevronRight, FolderIcon, FolderOpen, Pencil, Plus, Trash2 } from "lucide-react";
import SavedRequestItem from "./SavedRequestItem";

function FolderItem ({folder, depth} : {folder:Folder, depth: number}) {
   const [renaming, setRenaming] = useState(false)
    const [creatingChild, setCreatingChild] = useState(false)
    const [isDragOver, setIsDragOver] = useState(false)

    const folders = useCollectionsStore((s) => s.folders)
    const requestsStore = useCollectionsStore((s) => s.requests)
    const expandedFolderIds = useCollectionsStore((s) => s.expandedFolderIds)

    const toggleFolder = useCollectionsStore((s) => s.toggleFolder)
    const renameFolder = useCollectionsStore((s) => s.renameFolder)
    const deleteFolder = useCollectionsStore((s) => s.deleteFolder)
    const createFolder = useCollectionsStore((s) => s.createFolder)
    const moveFolder = useCollectionsStore((s) => s.moveFolder)
    const moveRequest = useCollectionsStore((s) => s.moveRequest)

    const isExpanded = expandedFolderIds.has(folder.id)
    const childFolders = React.useMemo(() => folders.filter((f) => f.parentFolderId === folder.id), [folders, folder.id])
    const requests = React.useMemo(() => requestsStore.filter((r) => r.folderId === folder.id), [requestsStore, folder.id])

    function handleToggle() {
        toggleFolder(folder.id)
    }

    function handleRename(name: string) {
        renameFolder(folder.id, name)
        setRenaming(false)
    }

    function handleDelete(e: React.MouseEvent) {
        e.stopPropagation()
        if (confirm(`Are you sure you want to delete folder "${folder.name}"?`)) {
            deleteFolder(folder.id)
        }
    }

    function handleAddFolder(e: React.MouseEvent) {
        e.stopPropagation()
        if (!isExpanded) toggleFolder(folder.id)
        setCreatingChild(true)
    }

    function handleCreateChild(name: string) {
        createFolder(folder.collectionId, folder.id, name)
        setCreatingChild(false)
    }

    // Drag and Drop
    function handleDragStart(e: React.DragEvent) {
        e.stopPropagation()
        e.dataTransfer.setData("text/plain", JSON.stringify({ type: "folder", id: folder.id }))
    }

    function handleDragOver(e: React.DragEvent) {
        e.preventDefault()
        e.stopPropagation()
    }

    function handleDragEnter(e: React.DragEvent) {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(true)
    }

    function handleDragLeave(e: React.DragEvent) {
        e.stopPropagation()
        setIsDragOver(false)
    }

    function isDescendantOf(targetId: string, parentId: string): boolean {
        let current = folders.find((f) => f.id === targetId)
        while (current && current.parentFolderId) {
            if (current.parentFolderId === parentId) return true
            current = folders.find((f) => f.id === current!.parentFolderId)
        }
        return false
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(false)

        try {
            const data = JSON.parse(e.dataTransfer.getData("text/plain"))
            if (!data || !data.id) return

            if (data.type === "request") {
                moveRequest(data.id, folder.collectionId, folder.id)
            } else if (data.type === "folder") {
                // Prevent dropping onto itself or descendants
                if (data.id === folder.id || isDescendantOf(folder.id, data.id)) {
                    return
                }
                moveFolder(data.id, folder.collectionId, folder.id)
            }
        } catch (err) {
            console.error("Drop failed:", err)
        }
    }

    return (
        <div>
            {/* Folder row */}
            <div
                onClick={handleToggle}
                draggable
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{ paddingLeft: `${depth * 16 + 4}px` }}
                className={`group flex items-center gap-1 py-1.5 pr-2 rounded-md
                           cursor-pointer transition-all duration-150 active:opacity-50 ${
                               isDragOver
                                   ? "bg-blue-500/20 border border-dashed border-blue-500/80"
                                   : "hover:bg-zinc-800/70 border border-transparent"
                           }`}
            >
                <ChevronRight
                    size={14}
                    className={`shrink-0 text-zinc-500 transition-transform duration-200
                               ${isExpanded ? "rotate-90" : ""}`}
                />
                {isExpanded
                    ? <FolderOpen size={14} className="shrink-0 text-amber-400" />
                    : <FolderIcon size={14} className="shrink-0 text-amber-400/70" />
                }

                {renaming ? (
                    <InlineRenameInput
                        initialValue={folder.name}
                        onSave={handleRename}
                        onCancel={() => setRenaming(false)}
                    />
                ) : (
                    <span className="text-sm text-zinc-300 truncate flex-1 ml-1">
                        {folder.name}
                    </span>
                )}

                {/* Action buttons */}
                {!renaming && (
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                            onClick={handleAddFolder}
                            className="text-zinc-500 hover:text-white p-0.5"
                            title="Add sub-folder"
                        >
                            <Plus size={12} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setRenaming(true) }}
                            className="text-zinc-500 hover:text-white p-0.5"
                            title="Rename"
                        >
                            <Pencil size={12} />
                        </button>
                        <button
                            onClick={handleDelete}
                            className="text-zinc-500 hover:text-red-400 p-0.5"
                            title="Delete folder"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                )}
            </div>

            {/* Children */}
            {isExpanded && (
                <div>
                    {/* Creating a new sub-folder inline */}
                    {creatingChild && (
                        <div style={{ paddingLeft: `${(depth + 1) * 16 + 20}px` }} className="py-1">
                            <InlineRenameInput
                                initialValue="New Folder"
                                onSave={handleCreateChild}
                                onCancel={() => setCreatingChild(false)}
                            />
                        </div>
                    )}

                    {childFolders.map((child) => (
                        <FolderItem key={child.id} folder={child} depth={depth + 1} />
                    ))}

                    {requests.map((req) => (
                        <SavedRequestItem key={req.id} request={req} depth={depth + 1} />
                    ))}

                    {childFolders.length === 0 && requests.length === 0 && !creatingChild && (
                        <div
                            style={{ paddingLeft: `${(depth + 1) * 16 + 20}px` }}
                            className="text-xs text-zinc-600 py-1 italic"
                        >
                            Empty
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default React.memo(FolderItem)