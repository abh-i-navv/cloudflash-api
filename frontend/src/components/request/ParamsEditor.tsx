import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Param = {
  key: string
  value: string
}

export default function ParamsEditor() {
  const [params, setParams] = useState<Param[]>([])

  function updateParam(
    index: number,
    field: "key" | "value",
    value: string
  ) {
    const updated = [...params]
    updated[index][field] = value
    setParams(updated)
  }

  function addParam() {
    const hasEmptyParam = params.some(
      (param) =>
        param.key.trim() === "" &&
        param.value.trim() === ""
    )

    if (hasEmptyParam) return

    setParams([
      ...params,
      { key: "", value: "" },
    ])
  }

  function removeParam(index: number) {
    const updated = params.filter(
      (_, i) => i !== index
    )

    setParams(updated)
  }

  return (
    <div className="flex flex-col gap-3">
      
      {params.map((param, index) => (
        <div
          key={index}
          className="flex gap-3 items-center"
        >
          
          <Input
            placeholder="Param Key"
            value={param.key}
            onChange={(e) =>
              updateParam(
                index,
                "key",
                e.target.value
              )
            }
            className="bg-zinc-900 border-zinc-800"
          />

          <Input
            placeholder="Param Value"
            value={param.value}
            onChange={(e) =>
              updateParam(
                index,
                "value",
                e.target.value
              )
            }
            className="bg-zinc-900 border-zinc-800"
          />

          <Button
            variant="destructive"
            onClick={() => removeParam(index)}
          >
            ×
          </Button>
        </div>
      ))}

      <Button
        variant="secondary"
        className="w-fit"
        onClick={addParam}
      >
        + Add Param
      </Button>
    </div>
  )
}