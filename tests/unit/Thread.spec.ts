import { Thread } from "@/state/store/Thread"
import { Timestamp, DocumentData } from '@firebase/firestore'

const example:DocumentData = {
  id: 'example',
  author: 'exampleAutor',
  created: new Timestamp(0, 0),
  updated: new Timestamp(1, 1),
  flowTime: new Timestamp(2, 2),
  replyCount: 2,
  lovedCount: 3,
  seenCount: 4,
  hidden: false,
  content: '<h1>exampleContent</h1>',
}
describe('Thread', () => {
  it('should be a valid Thread', () => {
    const thread = new Thread(example)
    expect(thread.id).toBe('example')
    expect(thread.author).toBe('exampleAutor')
    expect(thread.createdAt?.seconds).toBe(0)
    expect(thread.updatedAt?.seconds).toBe(1)
    expect(thread.flowTime?.toString().split('.')[0]).toBe('2000')
    expect(thread.replyCount).toBe(2)
    expect(thread.lovedCount).toBe(3)
    expect(thread.seenCount).toBe(4)
    expect(thread.hidden).toBe(false)
    expect(thread.content).toBe('<h1>exampleContent</h1>')
  })
})