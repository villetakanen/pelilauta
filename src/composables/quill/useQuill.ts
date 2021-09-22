import Quill from 'quill'

export default function useQuill (container: Element): Quill {
  return new Quill(container)
}
