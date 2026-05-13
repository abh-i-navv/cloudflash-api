import './App.css';
import TopBar from './components/layout/TopBar';
import RequestTabs from './components/request/RequestTabs';
import SideBar from './components/layout/SideBar';

function App() {
    return (
        <div className="h-screen w-screen overflow-hidden bg-zinc-950 text-white">
            <div className="flex h-full min-h-0">
                <SideBar />

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <TopBar />

                    <main className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
                        <div className="flex min-h-0 flex-1 flex-col gap-4">
                            <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
                                <div className="border-b border-zinc-800 px-4 py-3">
                                    <h2 className="text-sm font-medium">Request</h2>
                                </div>

                                <div className="flex min-h-0 flex-1 flex-col p-4">
                                    <RequestTabs />
                                </div>
                            </section>

                            <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
                                <div className="border-b border-zinc-800 px-4 py-3">
                                    <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                                        <span>Status: 200</span>
                                        <span>Time: 120ms</span>
                                        <span>Size: 1.2KB</span>
                                    </div>
                                </div>

                                <div className="min-h-0 flex-1 overflow-auto p-4">
                                    <pre className="whitespace-pre-wrap break-words text-sm text-zinc-300">
                                        {`{
                                            "message": "success"
                                        }`}
                                    </pre>
                                </div>
                            </section>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default App
