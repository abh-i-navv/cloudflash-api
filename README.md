# CloudFlash API

CloudFlash API is a desktop API client built with Wails, Go, React, and TypeScript. It lets you send HTTP requests, inspect responses, manage headers and query params, and keep a local request history.

## Features

- Send HTTP requests from a desktop app UI
- Choose request method and target URL
- Edit JSON request bodies
- Add and remove custom headers
- Add and remove query params
- View response body, headers, status, time, and payload size
- Persist request history locally with SQLite
- Reload previous requests from the sidebar

## Tech Stack

- Backend: Go
- Desktop runtime: Wails v2
- Frontend: React + TypeScript + Vite
- State management: Zustand
- UI: Tailwind CSS, Radix UI, shadcn/ui
- Editor: CodeMirror
- Database: SQLite via `modernc.org/sqlite`

## Project Structure

```text
cloudflash-api/
|-- app.go                     # Wails-exposed backend methods
|-- request.go                 # Request/response models and URL param helpers
|-- main.go                    # Wails app bootstrap
|-- database/
|   |-- db.go                  # SQLite initialization
|   `-- history.go             # Request history CRUD
|-- frontend/
|   |-- src/
|   |   |-- components/        # UI components
|   |   |-- store/             # Zustand request/response/history store
|   |   `-- ...
|   `-- ...
`-- data/
    `-- cloudflash.db          # Local SQLite database
```

## Requirements

- Go 1.24+
- Node.js 18+
- npm
- Wails CLI

Install Wails CLI if needed:

```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest
```

## Getting Started

1. Clone the repository.
2. Install frontend dependencies.
3. Run the Wails development server.

```bash
cd cloudflash-api
cd frontend
npm install
cd ..
wails dev
```

This starts the desktop app in development mode with live frontend reload.

## Build

Build the frontend:

```bash
cd frontend
npm run build
```

Build the desktop app:

```bash
wails build
```

## How It Works

When you send a request:

1. The frontend collects the method, URL, headers, params, and body from the Zustand store.
2. The request is passed to the Go backend through Wails bindings.
3. The backend merges query params into the URL and performs the HTTP request.
4. The response body, headers, status, time, and size are returned to the frontend.
5. The request is saved to SQLite history in the background.
6. The sidebar refreshes when history updates.

## Request History

Request history is stored locally in:

```text
data/cloudflash.db
```

Each history item currently stores:

- HTTP method
- URL
- Request body
- Created timestamp

## Development Notes

- Frontend source lives in `frontend/src`
- Wails-generated bindings live in `frontend/wailsjs`
- If Go structs change, regenerate bindings through the Wails dev/build flow

## Scripts

Frontend:

```bash
cd frontend
npm run dev
npm run build
```

Desktop app:

```bash
wails dev
wails build
```

