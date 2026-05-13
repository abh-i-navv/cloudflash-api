import JsonEditor from "../request/JsonEditor"

export default function ResponseViewer() {
    const response = `{
        "message": "success",
        "data": {
            "id": 1
        }
    }`

    return (
        <div className="flex-1 min-h-0">
            <JsonEditor value={response} editable={false} />
        </div>
    )
}