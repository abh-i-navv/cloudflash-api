import JsonEditor from "../request/JsonEditor"
import { Loader } from "lucide-react"
import { useActiveLoading, useActiveResponse } from "@/store/selectors/draftSelectors"

export default function ResponseViewer() {
    const response = useActiveResponse()
    const loading = useActiveLoading()

    return (
        loading ? (
            <div className="flex flex-1 items-center justify-center">
                <Loader />
            </div>
        ) : (<div className="flex-1 min-h-0 ">
            <JsonEditor value={response?.body ?? ""} editable={false} />
        </div>))

}
