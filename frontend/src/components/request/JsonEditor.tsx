import CodeMirror, { EditorView } from "@uiw/react-codemirror"
import { json } from "@codemirror/lang-json"
import { oneDark } from "@codemirror/theme-one-dark"
import { useMemo } from "react"
import React from "react"

type Props = {
  value: string
  onChange?: (value: string) => void
  editable?: boolean
}

const BASIC_SETUP = {
  foldGutter: false,
  dropCursor: false,
  allowMultipleSelections: false,
  highlightActiveLine: false,
}

function JsonEditorInner({
  value,
  onChange,
  editable=true
}: Props) {
  const extensions = useMemo(
    () => [json(), EditorView.editable.of(editable)],
    [editable]
  )

  return (
    <div className="h-full overflow-auto custom-scrollbar rounded-lg border border-zinc-800 ">
      <CodeMirror
        value={value}
        height="100%"
        theme={oneDark}
        extensions={extensions}
        onChange={(value) => onChange?.(value)}
        basicSetup={BASIC_SETUP}
      />
    </div>
  )
}

const JsonEditor = React.memo(JsonEditorInner)
export default JsonEditor
