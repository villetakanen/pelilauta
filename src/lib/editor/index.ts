import { Thread } from '@/state/threads'
import { ref, computed, Ref, ComputedRef } from 'vue'

const show: Ref<boolean> = ref(false)
const editorTopic: Ref<string> = ref('')
const editorPost: Ref<Thread|undefined> = ref(undefined)

function showEditor (): void;
function showEditor (topic: string): void;
function showEditor (post: Thread): void;

function showEditor (attr?: string|Thread): void {
  if (!attr) {
    editorTopic.value = ''
    editorPost.value = undefined
  } else if (typeof attr === 'string') {
    editorTopic.value = attr
    editorPost.value = undefined
  } else {
    const post = attr as Thread
    editorTopic.value = ''
    editorPost.value = post
  }
  show.value = true
}

function hideEditor (): void {
  show.value = false
}

const visible = computed(() => (show.value))
const topic = computed(() => (editorTopic.value))
const post = computed(() => (editorPost.value))

export function useEditorDialog (): {
  visible: ComputedRef<boolean>;
  topic: ComputedRef<string>;
  post: ComputedRef<Thread|undefined>;
  showEditor: {
    (): void;
    (topic: string): void;
    (post: Thread): void;
  };
  hideEditor: () => void;
  } {
  return { visible, showEditor, hideEditor, topic, post }
}
