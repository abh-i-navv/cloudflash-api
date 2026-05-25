import { useTabsStore } from "../tabsStore"

export const useActiveTab = () => {
    return useTabsStore((state) => state.tabs.find((tab) => tab.id === state.activeTabId))
}

export const useTabs = () => useTabsStore((state) => state.tabs)

export const useActiveTabId = () => useTabsStore((state) => state.activeTabId)