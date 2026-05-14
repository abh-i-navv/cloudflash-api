import { useRequestStore } from "@/store/requestStore"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function MethodSelector() {

  const method = useRequestStore((state) => state.method)

  const setMethod = useRequestStore((state) => state.setMethod)

  return (
    <Select value={method} onValueChange={setMethod}>
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
