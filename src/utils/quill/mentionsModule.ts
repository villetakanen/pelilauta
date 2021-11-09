
import { useAuthors } from '@/state/authors'
import Quill from 'quill'
// import Delta from 'quill-delta'
import { AuthorLinkBlot, MentionBlot } from './mentionBlot'

const _TRIGGER_KEY = '@'
const _END_KEYS = [' ', 'Spacebar']

export function mentionsModule (quill:Quill): void {
  let startIndex = 0
  let linking = false
  const { nonFrozenAuthors } = useAuthors()

  // When the user inserts @, we start trying to add a link
  quill.root.addEventListener('keydown', (event) => {
    if (event.defaultPrevented) return
    if (linking && _END_KEYS.includes(event.key)) matchNick(quill.getSelection()?.index ?? 0, quill.getSelection()?.length ?? 0)
    if (event.key !== _TRIGGER_KEY) return
    startLinking(quill.getSelection()?.index ?? 0, quill.getSelection()?.length ?? 0)
    event.preventDefault()
  }, true)

  const startLinking = (index: number, length: number) => {
    console.debug('mentionsModule.startLinking', startIndex, index, length, linking)
    startIndex = index
    linking = true
    if (length > 0) quill.deleteText(index, length, Quill.sources.USER)
    quill.insertText(quill.getSelection()?.index ?? 0, _TRIGGER_KEY, 'mention', 'user')
  }

  const matchNick = (index: number, length: number) => {
    // console.debug('mentionsModule.matchNick', startIndex, index, length, linking, quill.getContents(startIndex, index + length))
    const partial = ('' + quill.getContents(startIndex, index + length + 1).ops[0].insert).substring(1)
    const author = nonFrozenAuthors.value.find((a) => (a.nick.toLocaleLowerCase() === partial.toLocaleLowerCase()))

    if (!author) return // we do not have an author here

    linking = false
    console.debug('found', author.nick, author.uid, quill.getContents())
    quill.formatText(startIndex, index - startIndex, {
      mention: false,
      authorlink: '/u/' + author.uid
    }, Quill.sources.API)
    quill.setSelection(index + 1, 0)

    // emit event for vue editor component
    const event = new CustomEvent('quill.mention', { detail: author.uid })
    document.dispatchEvent(event)
  }

  console.debug('Quill Mentions module registered')
}
