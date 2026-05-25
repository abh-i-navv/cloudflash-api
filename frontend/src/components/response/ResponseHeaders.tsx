import { useActiveResponse } from "@/store/selectors/draftSelectors"

export default function ResponseHeaders() {
    const responseHeaders = useActiveResponse()?.headers ?? []

    return (
        <div className="flex flex-col gap-3">
            {
                responseHeaders.map((header, index) => {
                    return (<div key={header.key || index} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3">
                        <div className="font-mono text-sm text-zinc-300">
                            {header.key}
                        </div>
                        <div className="font-mono text-sm text-zinc-500">
                            {header.value}
                        </div>
                    </div>)
                })
            }

        </div>
    )
}
