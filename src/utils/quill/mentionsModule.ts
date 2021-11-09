
import { useAuthors } from '@/state/authors'
import Quill from 'quill'
import { logDebug } from '../eventLogger'

const Module = Quill.import('core/module')

const _TRIGGER_KEY = '@'
const _END_KEYS = [' ', 'Spacebar']

export class MentionsModule extends Module {
  private quill:Quill
  private linking = false

  constructor (quill:Quill) {
    super(quill)
    logDebug('MentionsModule constructor called')
    this.quill = quill

    quill.on('text-change', (delta) => {
      if (delta?.ops?.length > 1) {
        if (delta.ops[1].delete) this.stopLinking()
        if (delta.ops[1].insert === _TRIGGER_KEY) this.startLinking()
      } else {
        if (delta.ops[0].delete) this.stopLinking()
        if (delta.ops[0].insert === _TRIGGER_KEY) this.startLinking()
      }
    })
  }

  private startLinking () {
    logDebug('MentionsModule startLinking')
    const selection = this.quill.getSelection()
    logDebug(selection?.index)
    this.quill.formatText(
      (selection?.index || 1) - 1,
      1,
      { mention: true },
      Quill.sources.API
    )
    this.linking = true
  }

  private stopLinking () {
    logDebug('MentionsModule stopLinking')
    this.linking = false
  }
}
/* et startIndex = 0
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
} */
