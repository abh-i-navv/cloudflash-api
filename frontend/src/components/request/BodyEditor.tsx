import { useState } from "react";
import { Textarea } from "../ui/textarea";
import JsonEditor from "./JsonEditor";
import { useRequestStore } from "@/store/requestStore";

export default function BodyEditor() {
    // const [body, setBody] = useState(`{"email": "abc@abc.com"}`)

    const body = useRequestStore((state) => state.body)

    const setBody = useRequestStore((state) => state.setBody)

    return (
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
            <div className="mb-3 shrink-0 text-sm text-zinc-400">
                Raw JSON Body
            </div>

            <div className="min-h-0 flex-1 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950">
                {/* <Textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    spellCheck={false}
                    className="h-full min-h-0 w-full resize-none overflow-auto rounded-md border-0 bg-transparent font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                    style={{ fieldSizing: "fixed" }}
                /> */}
                <JsonEditor value={body} onChange={setBody}/>
            </div>
        </div>
    )
}
