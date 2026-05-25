import { RequestDraft, useTabsStore } from "../tabsStore"
import { useActiveTab } from "./tabSelectors"

export const useActiveDraft = () => useActiveTab()?.draft
export const useActiveResponse = () => useActiveTab()?.response
export const useActiveLoading = () => useActiveTab()?.loading ?? false
export const useActiveError = () => useActiveTab()?.error ?? ""

export const useUpdateActiveDraft = () => {
    const activeTabId = useTabsStore((state) => state.activeTabId)
    const updateDraft = useTabsStore((state) => state.updateDraft)

    return (updates: Partial<RequestDraft>) => {
        if(!activeTabId) return

        updateDraft(activeTabId, updates)
    }
}
