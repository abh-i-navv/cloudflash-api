import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useActiveDraft, useUpdateActiveDraft } from "@/store/selectors/draftSelectors"

export default function MethodSelector() {
  const draft = useActiveDraft()
  const updateDraft = useUpdateActiveDraft()

  return (
    <Select value={draft?.method ?? "GET"} onValueChange={(value) => updateDraft({method: value})}>
      <SelectTrigger className="w-24 ">
        <SelectValue />
      </SelectTrigger>

      <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
        <SelectItem value="GET" >GET</SelectItem>
        <SelectItem value="POST" >POST</SelectItem>
        <SelectItem value="PUT" >PUT</SelectItem>
        <SelectItem value="PATCH" >PATCH</SelectItem>
        <SelectItem value="DELETE" >DELETE</SelectItem>
      </SelectContent>
    </Select>
  )
}
