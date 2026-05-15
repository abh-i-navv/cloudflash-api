import { useRequestStore } from "@/store/requestStore"
import JsonEditor from "../request/JsonEditor"
import { Loader } from "lucide-react"

export default function ResponseViewer() {
    const responseBody = useRequestStore((state) => state.responseBody)
    const loading = useRequestStore((state) => state.loading)

    return( 
        loading ? (
        <div className="flex flex-1 items-center justify-center">
            <Loader />
        </div>
        ) : (<div className="flex-1 min-h-0  custom-scrollbar">
            <JsonEditor value={responseBody} editable={false} />
        </div>))
    
}
