import { useRequestStore } from "@/store/requestStore"
import JsonEditor from "../request/JsonEditor"
import { Loader } from "lucide-react"
import { useResponseStore } from "@/store/responseStore"

export default function ResponseViewer() {
    const responseBody = useResponseStore((state) => state.responseBody)
    const loading = useRequestStore((state) => state.loading)

    return (
        loading ? (
            <div className="flex flex-1 items-center justify-center">
                <Loader />
            </div>
        ) : (<div className="flex-1 min-h-0 ">
            <JsonEditor value={responseBody} editable={false} />
        </div>))

}
