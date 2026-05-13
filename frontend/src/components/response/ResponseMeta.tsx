export default function ResponseMeta() {
    return (
        <div className="flex gap-3 text-sm mb-4">
      
      <div className="px-3 py-1 rounded-md bg-green-500/10 text-green-400 border border-green-500/20">
        200 OK
      </div>

      <div className="px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400">
        124ms
      </div>

      <div className="px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400">
        1.2KB
      </div>
    </div>
    )
}