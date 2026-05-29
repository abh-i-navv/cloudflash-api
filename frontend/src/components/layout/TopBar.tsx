import MethodSelector from "../request/MethodSelector";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loader, Save } from "lucide-react";
import { useActiveDraft, useActiveLoading, useUpdateActiveDraft } from "@/store/selectors/draftSelectors";
import { useTabsStore } from "@/store/tabsStore";
import { useState, useEffect } from "react";
import SaveRequestModal from "../request/SaveRequestModal";

export default function TopBar() {
  const draft = useActiveDraft()
  const updateDraft = useUpdateActiveDraft()

  const loading = useActiveLoading()
  const sendRequest = useTabsStore((state) => state.sendActiveRequest)

  const [showSaveModal, setShowSaveModal] = useState(false)

  // Listen for Ctrl+S / Cmd+S
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        if (draft && draft.url.trim()) {
          setShowSaveModal(true)
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [draft])

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-800 bg-zinc-900 px-4">

      {/* Method Selector */}
      <MethodSelector />

      {/* URL Input */}
      <Input value={draft?.url ?? ""} onChange={(e) => updateDraft({url: e.target.value})} type="text" placeholder="Enter request URL..." className="flex-1 bg-zinc-800 border border-zinc-700 rounded-md hover:bg-zinc-700 px-4 py-2 text-sm outline-none" />

      {/* Save Button */}
      <Button 
        onClick={() => setShowSaveModal(true)} 
        disabled={!draft?.url.trim()} 
        variant="outline" 
        className="gap-2 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
      >
        <Save size={15} />
        Save
      </Button>

      {/* Send Button */}
      <Button onClick={sendRequest} disabled={loading || !draft?.url.trim()}>{loading ? <Loader /> : "Send"}</Button>

      {/* Save Request Modal */}
      <SaveRequestModal 
        isOpen={showSaveModal} 
        onClose={() => setShowSaveModal(false)} 
        draft={draft}
      />
    </header>
  )
}
