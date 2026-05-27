import "./App.css"

import TopBar from "./components/layout/TopBar"
import SideBar from "./components/layout/SideBar"

import RequestTabs from "./components/request/RequestTabs"

import ResponseMeta from "./components/response/ResponseMeta"
import ResponseTabs from "./components/response/ResponseTabs"

import { Toaster } from "sonner"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable"
import RequestMultiTabs from "./components/request/RequestMultiTab"
import { useEffect } from "react"
import { useTabsStore } from "./store/tabsStore"

function App() {
  const loadTabsState = useTabsStore((state) => state.loadTabsState)

  useEffect(() => {
    loadTabsState()
  }, [loadTabsState])

  return (
    <div className="h-screen w-screen overflow-hidden bg-zinc-950 text-white">
        <Toaster position="bottom-right" richColors closeButton />


        <ResizablePanelGroup orientation="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize="20%" minSize="15%" maxSize="35%">
            <SideBar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="80%">
            <div className="flex h-full min-h-0 flex-col overflow-hidden">
              <RequestMultiTabs />
              <TopBar />

              <main className="flex min-h-0 min-w-0 flex-1 overflow-hidden p-4">
                <ResizablePanelGroup
                  orientation="vertical"
                  className="min-h-0 flex-1 gap-4"
                >
                  {/* Request Panel */}
                  <ResizablePanel defaultSize={"50%"} minSize={"20%"}>
                    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
                      {/* <div className="border-b border-zinc-800 px-4 py-3"> */}
                        {/* <h2 className="text-sm font-medium">Request</h2> */}
                      {/* </div> */}
                      <div className="flex min-h-0 flex-1 flex-col overflow-auto p-4">
                        <RequestTabs />
                      </div>
                    </section>
                  </ResizablePanel>

                  <ResizableHandle withHandle />

                  {/* Response Panel */}
                  <ResizablePanel defaultSize={"50%"} minSize={"20%"}>
                    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
                      <div className="border-b border-zinc-800 px-4 py-3">
                        <ResponseMeta />
                      </div>

                      <div className="min-h-0 flex-1 overflow-auto p-4">
                        <div className="flex min-h-0 flex-1 flex-col">
                          <ResponseTabs />
                        </div>
                      </div>
                    </section>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </main>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
    </div>
  )
}

export default App