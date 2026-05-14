import { useRequestStore } from "@/store/requestStore"
import JsonEditor from "../request/JsonEditor"
import { Loader } from "lucide-react"

function formatResponse(response: string) {
    try {
        return JSON.stringify(JSON.parse(response),null,2)
    } catch (error) {
        return response
    }
}

export default function ResponseViewer() {
    const responseBody = useRequestStore((state) => state.responseBody)
    const loading = useRequestStore((state) => state.loading)

    return( 
        loading ? (
        <div className="flex flex-1 items-center justify-center">
            <Loader />
        </div>
        ) : (<div className="flex-1 min-h-0">
            <JsonEditor value={formatResponse(responseBody)} editable={false} />
        </div>))
    
}