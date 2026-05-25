import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useActiveDraft, useUpdateActiveDraft } from "@/store/selectors/draftSelectors"
import { Param } from "@/types/global"
import { X } from "lucide-react"

export default function ParamsEditor() {
  const draft = useActiveDraft()
  const updateDraft = useUpdateActiveDraft()
  const params = draft?.params ?? []

  const setParams = (params: Param[]) => updateDraft({ params })

  function updateParam(
    index: number,
    field: "key" | "value",
    value: string
  ) {
    const newParams = [...params]

    newParams[index] = {
      ...newParams[index], [field]: value,
    }
    setParams(newParams)
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
    setParams(params.filter((_, i) => i !== index))
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
            size="icon"
            onClick={() => removeParam(index)}
          >
            <X />
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
