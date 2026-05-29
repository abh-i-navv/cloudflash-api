import { SavedRequest, useCollectionsStore } from "@/store/CollectionsStore";
import { useTabsStore } from "@/store/tabsStore";
import { Header, Param } from "@/types/global";
import { Trash2 } from "lucide-react";
import React from "react";

const METHOD_COLORS: Record<string, string> = {
    GET: "text-green-400",
    POST: "text-yellow-400",
    PUT: "text-blue-400",
    PATCH: "text-orange-400",
    DELETE: "text-red-400",
    HEAD: "text-purple-400",
    OPTIONS: "text-teal-400",
}

function SavedRequestItem({request, depth}: {request: SavedRequest, depth: number}) {
    const deleteRequest = useCollectionsStore((state) => state.deleteRequest)
    const createTab = useTabsStore((state) => state.createTab)

    function handleClick() {
        let headers: Header[] = []
        let params: Param[] = []
        
        try {
            headers = JSON.parse(request.headers)
        } catch (error) {
            console.log("error parsing json",error)
        }

        try {
            params = JSON.parse(request.params)
        } catch (error) {
            console.log("error parsing params")
        }
        
        createTab({
            method: request.method,
            url: request.url,
            body: request.body,
            headers,
            params
        })
    }

    function handleDelete(e: React.MouseEvent){
        e.stopPropagation()
        deleteRequest(request.id)
    }

    function handleDragStart(e:React.DragEvent){
        e.stopPropagation()
        e.dataTransfer.setData("text/plain", JSON.stringify({type: "request", id: request.id}))
    }

    const methodColor = METHOD_COLORS[request.method.toUpperCase()] ?? "text-zinc-400"

    return (
        <div 
            onClick={handleClick}
            draggable
            onDragStart={handleDragStart}
            style={{ paddingLeft: `${depth * 16 + 12}px` }}
            className="group flex items-center gap-2 py-1.5 pr-2 rounded-md
                       cursor-pointer transition-colors hover:bg-zinc-800/70 active:opacity-50">
            
            <span >
                {request.method.length > 4 ? request.method.slice(0,3) : request.method}
            </span>
            <span className="text-sm text-zinc-300 truncate flex-1">{request.name}</span>
            <button
                onClick={handleDelete}
                className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400
                           transition-opacity shrink-0 p-0.5"
            >
                <Trash2 size={12} />
            </button>
        </div>
    )
}

export default React.memo(SavedRequestItem)