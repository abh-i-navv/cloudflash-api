import './App.css';
import TopBar from './components/layout/TopBar';
import RequestTabs from './components/request/RequestTabs';
import SideBar from './components/layout/SideBar';
import ResponseMeta from './components/response/ResponseMeta';
import ResponseTabs from './components/response/ResponseTabs';

function App() {
    return (
        <div className="h-screen w-screen overflow-hidden bg-zinc-950 text-white">
            <div className="flex h-full min-h-0">
                <SideBar />

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <TopBar />

                    <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-4">
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
                                    <ResponseMeta />
                                </div>

                                <div className="min-h-0 flex-1 overflow-auto p-4">
                                    <div className="flex-1 min-h-0">
                                        <ResponseTabs />
                                    </div>
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
