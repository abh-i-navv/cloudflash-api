import { useEffect, useRef, useState } from "react"

type InlineRenameProps = {
    initialValue: string
    onSave: (value: string) => void
    onCancel: () => void
}

export default function InlineRenameInput({initialValue, onSave, onCancel} : InlineRenameProps) {

    const [value, setValue] = useState(initialValue)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
    },[])

    function handleKeyDown(e: React.KeyboardEvent) {
        if(e.key === "Enter") {
            const trimmed = value.trim()
            if(trimmed && trimmed !== initialValue) {
                onSave(trimmed)
            }
            else{
                onCancel()
            }
        }
        else if(e.key === "Escape"){
            onCancel()
        }
    }

    function handleBlur() {
        const trimmed = value.trim()
            if(trimmed && trimmed !== initialValue) {
                onSave(trimmed)
            }
            else{
                onCancel()
            }
    }

    return (
        <input 
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="flex-1 min-w-0 bg-zinc-800 text-sm text-white rounded px-1.5 py-0.5
                       border border-zinc-600 outline-none focus:border-blue-500
                       transition-colors"
        />
    )
}