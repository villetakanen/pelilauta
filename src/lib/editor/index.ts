import { ref, computed, Ref, ComputedRef } from 'vue'
import { Post } from '../stream'

const show: Ref<boolean> = ref(false)
const editorTopic: Ref<string> = ref('')
const editorPost: Ref<Post|undefined> = ref(undefined)

function showEditor (): void;
function showEditor (topic: string): void;
function showEditor (post: Post): void;

function showEditor (attr?: string|Post): void {
  if (!attr) {
    editorTopic.value = ''
    editorPost.value = undefined
  } else if (typeof attr === 'string') {
    editorTopic.value = attr
    editorPost.value = undefined
  } else {
    const post = attr as Post
    editorTopic.value = post.data.topic
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
  post: ComputedRef<Post|undefined>;
  showEditor: {
    (): void;
    (topic: string): void;
    (post: Post): void;
  };
  hideEditor: () => void;
  } {
  return { visible, showEditor, hideEditor, topic, post }
}
