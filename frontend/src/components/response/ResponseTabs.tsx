import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import ResponseViewer from "./ResponseViewer"

export default function ResponseTabs() {
  return (
    <Tabs
      defaultValue="body"
      className="h-full flex flex-col min-h-0"
    >
      <TabsList className="w-fit bg-zinc-900 border border-zinc-800">
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
        Response headers
      </TabsContent>
    </Tabs>
  )
}