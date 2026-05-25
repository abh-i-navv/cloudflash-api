import { useActiveDraft, useUpdateActiveDraft } from "@/store/selectors/draftSelectors"
import { Header } from "@/types/global"
import { X } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

export default function HeadersEditor() {
  const draft = useActiveDraft()
  const updateDraft = useUpdateActiveDraft()
  const headers = draft?.headers ?? []

  const setHeaders = (headers: Header[]) => updateDraft({ headers })

  function updateHeader(index: number, field: "key" | "value", value: string) {
    const newHeaders = [...headers]

    newHeaders[index] = { ...newHeaders[index], [field]: value }
    setHeaders(newHeaders)
  }

  function addHeader() {
    const hasEmptyHeader = headers.some(
      (header) =>
        header.key.trim() === "" &&
        header.value.trim() === ""
    )

    if (hasEmptyHeader) return
    setHeaders([...headers, { key: "", value: "" }])
  }

  function removeHeader(index: number) {
    setHeaders(headers.filter((_, i) => i !== index))
  }

  return (
    <div className="flex min-h-0 flex-col gap-3">
      {headers.map((header, index) => (
        <div
          key={index}
          className="flex gap-3 items-center"
        >
          <Input
            placeholder="Header Key"
            value={header.key}
            onChange={(e) =>
              updateHeader(index, "key", e.target.value)
            }
            className="bg-zinc-900 border-zinc-800"
          />

          <Input
            placeholder="Header Value"
            value={header.value}
            onChange={(e) =>
              updateHeader(index, "value", e.target.value)
            }
            className="bg-zinc-900 border-zinc-800"
          />

          <Button
            variant="destructive"
            size="icon"
            onClick={() => removeHeader(index)}
          >
            <X />
          </Button>
        </div>
      ))}

      <Button
        variant="secondary"
        className="w-fit"
        onClick={addHeader}
      >
        + Add Header
      </Button>
    </div>
  )
}
