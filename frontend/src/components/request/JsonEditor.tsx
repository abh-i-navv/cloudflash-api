import CodeMirror, { EditorView } from "@uiw/react-codemirror"
import { json } from "@codemirror/lang-json"
import { oneDark } from "@codemirror/theme-one-dark"

type Props = {
  value: string
  onChange?: (value: string) => void
  editable?: boolean
}

export default function JsonEditor({
  value,
  onChange,
  editable=true
}: Props) {
  return (
    <div className="h-full overflow-hidden rounded-lg border border-zinc-800 ">
      <CodeMirror
        value={value}
        height="100%"
        theme={oneDark}
        extensions={[json(),EditorView.editable.of(editable)]}
        onChange={onChange}
        basicSetup={{
          foldGutter: false,
          dropCursor: false,
          allowMultipleSelections: false,
          highlightActiveLine: false,
        }}
      />
    </div>
  )
}