import React from 'react'
import {createRoot} from 'react-dom/client'
import './style.css'
import App from './App'

type ErrorBoundaryProps = {
  children: React.ReactNode
}

type ErrorBoundaryState = {
  error: Error | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App crashed during render:", error, errorInfo)
  }

  override render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-zinc-950 p-6 text-white">
          <h1 className="mb-3 text-xl font-semibold text-red-400">Frontend startup error</h1>
          <pre className="overflow-auto rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-200">
            {this.state.error.stack || this.state.error.message}
          </pre>
        </div>
      )
    }

    return this.props.children
  }
}

window.addEventListener("error", (event) => {
  console.error("Unhandled window error:", event.error || event.message)
})

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason)
})

const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <App/>
        </ErrorBoundary>
    </React.StrictMode>
)
