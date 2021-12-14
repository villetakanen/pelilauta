import { Storable } from "@/state/store/Storable"
import { Timestamp } from '@firebase/firestore'

describe('Storable', () => {
  it('Should always have an id', () => {
    const storable = new Storable('id')
    expect(storable.id).toBeDefined();
  })
  it('Should be comparable to another Storable with a flowTime', () => {
    const storable1 = new Storable('id1')
    const storable2 = new Storable('id2')
    storable1.docData = { updated: new Timestamp(1, 1) }
    storable2.docData = { updated: new Timestamp(2, 2) }
    expect(storable1.compareFlowTime(storable2)).toBe(-1)
  })
})