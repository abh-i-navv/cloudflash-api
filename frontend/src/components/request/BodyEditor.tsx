import JsonEditor from "./JsonEditor";
import { useActiveDraft, useUpdateActiveDraft } from "@/store/selectors/draftSelectors";

export default function BodyEditor() {
    const draft = useActiveDraft()
    const updateDraft = useUpdateActiveDraft()

    return (
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
            <div className="mb-3 shrink-0 text-sm text-zinc-400">
                Raw JSON Body
            </div>

            <div className="min-h-0 flex-1 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950">
                <JsonEditor value={draft?.body ?? ""} onChange={(body) => updateDraft({ body })} />
            </div>
        </div>
    )
}
