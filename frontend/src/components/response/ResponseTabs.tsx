import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import ResponseViewer from "./ResponseViewer"
import ResponseHeaders from "./ResponseHeaders"

export default function ResponseTabs() {
  return (
    <Tabs
      defaultValue="body"
      className="h-full flex flex-col min-h-0"
    >
      <TabsList className="w-fit border border-zinc-800 bg-zinc-950">
        <TabsTrigger value="body">
          Body
        </TabsTrigger>

        <TabsTrigger value="headers">
          Headers
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="body"
        className="flex-1 mt-4 min-h-0"
      >
        <ResponseViewer />
      </TabsContent>

      <TabsContent
        value="headers"
        className="flex-1 mt-4"
      >
        <ResponseHeaders />
      </TabsContent>
    </Tabs>
  )
}