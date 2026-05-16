import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRequestStore } from "@/store/requestStore"


export default function ParamsEditor() {

  const params = useRequestStore((state) => state.params)
  const setParams = useRequestStore((state) => state.setParams)

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