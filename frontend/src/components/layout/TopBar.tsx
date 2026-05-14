import { useRequestStore } from "@/store/requestStore";
import MethodSelector from "../request/MethodSelector";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function TopBar() {
  const url = useRequestStore((state) => state.url)

  const setUrl = useRequestStore((state) => state.setUrl)

  return(
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-800 bg-zinc-900 px-4">
        
        {/* Method Selector */}
          <MethodSelector />

        {/* URL Input */}

        <Input value={url} onChange={(e) => setUrl(e.target.value)} type="text" placeholder="Enter request URL..." className="flex-1 bg-zinc-800 border border-zinc-700 rounded-md hover:bg-zinc-700 px-4 py-2 text-sm outline-none"/>

        {/* Send Button */}
        <Button>Send</Button>
      </header>
  )
}
