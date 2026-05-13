import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

type Header = {
  key: string
  value: string
}

export default function HeadersEditor() {
    const [headers, setHeaders] = useState<Header[]>([{key: "", value: ""}])

    function updateHeader(index: number, field: "key" | "value", value: string) {
        const newHeaders = [...headers]

        newHeaders[index][field] = value
        setHeaders(newHeaders)
    }

    function addHeader(){
        const hasEmptyHeader = headers.some(
            (header) =>
            header.key.trim() === "" &&
            header.value.trim() === ""
        )

        if (hasEmptyHeader) return
        setHeaders([...headers, {key: "", value:""}])
    }

    function removeHeader(index: number){
        const newHeaders = headers.filter((_, i) => i !== index)
        setHeaders(newHeaders)
    }

    return (
        <div className="flex min-h-0 flex-col gap-3">
      
      {headers.map((header, index) => (
        <div
          key={index}
          className="flex gap-3 items-center"
        >
          
          {/* Header Key */}
          <Input
            placeholder="Header Key"
            value={header.key}
            onChange={(e) =>
              updateHeader(index, "key", e.target.value)
            }
            className="bg-zinc-900 border-zinc-800"
          />

          {/* Header Value */}
          <Input
            placeholder="Header Value"
            value={header.value}
            onChange={(e) =>
              updateHeader(index, "value", e.target.value)
            }
            className="bg-zinc-900 border-zinc-800"
          />

          {/* Remove Button */}
          <Button
            variant="destructive"
            onClick={() => removeHeader(index)}
          >
            ×
          </Button>
        </div>
      ))}

      {/* Add Header */}
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
