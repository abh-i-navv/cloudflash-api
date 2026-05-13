import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import HeadersEditor from "./HeadersEditor"
import BodyEditor from "./BodyEditor"
import ParamsEditor from "./ParamsEditor"

export default function RequestTabs() {
    return (
        <Tabs defaultValue="headers" className="flex min-h-0 flex-1 flex-col overflow-hidden">
      
        <TabsList className="w-fit shrink-0 border border-zinc-800 bg-zinc-950">
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="params">Params</TabsTrigger>
        </TabsList>

        <TabsContent value="headers" className="mt-4 min-h-0 flex-1 overflow-hidden">
           <div className="h-full min-h-0 overflow-auto pr-1">
             <HeadersEditor />
           </div>
        </TabsContent>

        <TabsContent value="body" className="mt-4 min-h-0 flex-1 overflow-hidden">
           <BodyEditor />
        </TabsContent>

        <TabsContent value="params" className="mt-4 min-h-0 flex-1 overflow-auto">
            <div className="text-sm text-zinc-400">
                <ParamsEditor />
            </div>
        </TabsContent>

        </Tabs>
    )
}
