import { useRequestStore } from "@/store/requestStore"

const headers = {
    "content-type": "application/json",
    "cache-control": "no-cache",
    "server": "nginx",
}

export default function ResponseHeaders() {
    const responseHeaders = useRequestStore((state) => state.responseHeaders)

    return (
        <div className="flex flex-col gap-3">
            {
                responseHeaders.map( (header) => {
                    return(<div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3">
                        <div className="font-mono text-sm text-zinc-300">
                            {header.key}
                        </div>
                        <div className="font-mono text-sm text-zinc-500">
                            {header.value}
                        </div>
                    </div>)
                } )
            }

        </div>
    )
}