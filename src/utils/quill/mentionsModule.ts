
import { AuthorClass, useAuthors } from '@/state/authors'
import Quill from 'quill'
import { logDebug } from '../eventLogger'

const Module = Quill.import('core/module')

const _TRIGGER_KEY = '@'
const _END_KEYS = [' ', 'Spacebar']

export class MentionsModule extends Module {
  private quill:Quill
  private linking = -1

  constructor (quill:Quill) {
    super(quill)
    logDebug('MentionsModule constructor called')
    this.quill = quill

    /* quill.on('text-change', (delta) => {
      if (delta?.ops?.length > 1) {
        if (delta.ops[1].delete) this.stopLinking()
        if (delta.ops[1].insert === _TRIGGER_KEY) this.startLinking()
      } else {
        if (delta.ops[0].delete) this.stopLinking()
        if (delta.ops[0].insert === _TRIGGER_KEY) this.startLinking()
      }
    })
    quill.on('selection-change', (range, oldRange, source) => {
      logDebug(range, oldRange, source)
    }) */
    /* quill.keyboard.addBinding(
      { key: '@' },
      (range, context) => {
        logDebug('@', range)
        if (context.format.mention === null) {
          this.startLinking()
        }
      }
    ) */
    // Note: due to alt+ctrl+whatnot, we can not use the keyboard
    // module to listen to @ signs. We can however detect it from the
    // text-chanbes
    quill.on('text-change', (delta, oldDelta, source) => {
      if (source !== Quill.sources.USER) {
        logDebug('change not from user')
        return
      }
      const lastOp = delta.ops[delta.ops.length - 1]
      if (typeof lastOp.insert !== 'string') return
      if (
        !quill.getFormat().mention &&
        lastOp.insert === _TRIGGER_KEY) this.startLinking()
      else if (lastOp.insert &&
        quill.getFormat().mention &&
        _END_KEYS.includes(lastOp.insert)
      ) {
        const { authors } = useAuthors()
        const currentIndex = quill.getSelection()?.index || 1
        const startIndex = this.linking
        const text = quill.getText(startIndex, currentIndex)
        const author = authors.value.find((a) => (a.nick.toLowerCase() === text.toLowerCase().trim()))

        logDebug(text, author?.nick)

        if (author) this.createAuthorLink(startIndex, currentIndex, author)
      }
    })
    quill.keyboard.addBinding(
      { key: 8 },
      { format: ['mention'] },
      () => this.stopLinking()
    )
    quill.keyboard.addBinding(
      { key: 8 },
      { format: ['mention'] },
      () => this.stopLinking()
    )
  }

  private startLinking () {
    if (this.linking >= 0) {
      logDebug('MentionsModule tries to start linking, while linking: will stop linking instead.')
      this.stopLinking()
      return
    }
    logDebug('MentionsModule starts linking')
    const index = this.quill.getSelection()?.index || 1
    logDebug(index)
    this.quill.formatText(
      index - 1,
      1,
      { mention: true },
      Quill.sources.API
    )
    logDebug(this.quill.getBounds(index))
    this.linking = index
  }

  private stopLinking () {
    logDebug('MentionsModule stopLinking')
    const currentIndex = this.quill.getSelection()?.index || 1
    this.quill.formatText(
      this.linking - 1,
      currentIndex - this.linking + 1,
      { mention: false },
      Quill.sources.API
    )
    this.linking = -1
  }

  private createAuthorLink (start:number, end:number, author:AuthorClass) {
    this.stopLinking()
    this.quill.formatText(
      start - 1,
      end - start,
      {
        authorlink: '/u/' + author.uid
      },
      Quill.sources.API
    )
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
