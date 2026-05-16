import JsonEditor from "./JsonEditor";
import { useRequestStore } from "@/store/requestStore";

export default function BodyEditor() {

    const body = useRequestStore((state) => state.body)

    const setBody = useRequestStore((state) => state.setBody)

    return (
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
            <div className="mb-3 shrink-0 text-sm text-zinc-400">
                Raw JSON Body
            </div>

            <div className="min-h-0 flex-1 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950">
                <JsonEditor value={body} onChange={setBody} />
            </div>
        </div>
    )
}
