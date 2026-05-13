import { Button } from "../ui/button"

export default function SideBar() {
    return(
        <aside className="flex h-full w-64 shrink-0 flex-col overflow-hidden border-r border-zinc-800 bg-zinc-900">
        
        {/* Sidebar Header */}
        <div className="h-14 border-b border-zinc-800 flex items-center px-4">
          <h1 className="text-lg font-semibold">CloudFlash</h1>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-auto p-4">
          {/* <button className="w-full bg-zinc-800 hover:bg-zinc-700 transition rounded-md py-2 text-sm">
            + New Request
          </button> */}
            <Button className="w-full">+ New Request</Button>

          <div className="mt-6 space-y-2">
            <div className="bg-zinc-800 rounded-md px-3 py-2 text-sm cursor-pointer hover:bg-zinc-700">
              GET /users
            </div>

            <div className="bg-zinc-800 rounded-md px-3 py-2 text-sm cursor-pointer hover:bg-zinc-700">
              POST /login
            </div>
          </div>
        </div>
      </aside>
    )
}
