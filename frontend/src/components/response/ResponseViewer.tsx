import { useRequestStore } from "@/store/requestStore"
import JsonEditor from "../request/JsonEditor"

export default function ResponseViewer() {
    const responseBody = useRequestStore((state) => state.responseBody)

    return (
        <div className="flex-1 min-h-0">
            <JsonEditor value={responseBody} editable={false} />
        </div>
    )
}