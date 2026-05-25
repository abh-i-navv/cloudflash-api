import MethodSelector from "../request/MethodSelector";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loader } from "lucide-react";
import { useActiveDraft, useActiveLoading, useUpdateActiveDraft } from "@/store/selectors/draftSelectors";
import { useTabsStore } from "@/store/tabsStore";

export default function TopBar() {
  const draft = useActiveDraft()
  const updateDraft = useUpdateActiveDraft()

  const loading = useActiveLoading()
  const sendRequest = useTabsStore((state) => state.sendActiveRequest)

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-800 bg-zinc-900 px-4">

      {/* Method Selector */}
      <MethodSelector />

      {/* URL Input */}
      <Input value={draft?.url ?? ""} onChange={(e) => updateDraft({url: e.target.value})} type="text" placeholder="Enter request URL..." className="flex-1 bg-zinc-800 border border-zinc-700 rounded-md hover:bg-zinc-700 px-4 py-2 text-sm outline-none" />

      {/* Send Button */}
      <Button onClick={sendRequest} disabled={loading || !draft?.url.trim()}>{loading ? <Loader /> : "Send"}</Button>
    </header>
  )
}
