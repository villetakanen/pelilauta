import { DeltaOperation } from '@/utils/contentFormat'

export class DeltaParser {
  private formatStack
  private contentStack
  private ops

  constructor () {
    this.formatStack = new Array<string>()
    this.contentStack = new Array<string>()
    this.ops = new Array<DeltaOperation>()
  }

  setOps (ops:DeltaOperation[]): void {
    this.ops = ops
  }

  renderHTML (): string {
    if (!this.ops) return ''
    // Reset stacks
    this.formatStack = new Array<string>()
    this.contentStack = new Array<string>()

    let html = ''
    this.ops.forEach((op) => {
      html += this.renderOp(op)
    })
    html += this.clearStack()

    return html
  }

  private clearStack ():string {
    let html = ''
    while (this.formatStack.length > 0) {
      html += '</' + this.formatStack.pop() + '>\n'
    }
    return html
  }

  private renderOp (op:DeltaOperation): string {
    /* let html = ''
    if (op.insert !== '\n' && typeof op.insert === 'string') {
      if (!op.attributes) {
        t
      }
    }
    return html
  } */
    return ''
  }
}
