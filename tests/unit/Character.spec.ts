import { Character, CharacterSheetModel } from  '@/state/characters/Character'

const sheetModel1:CharacterSheetModel = {
  layout: [],
  stats: {
    'strength': {
      label: {
        en: 'Strength'
      },
      type: 'number'
    },
    'strength bonus': {
      label: {
        en: 'Strength bonus'
      },
      type: 'derived',
      formula: '( strength - 10 ) / 2'
    }
  }
}

const stats1 = new Map<string, number>([
  ['strength', 12]
])

describe('Character derived stats', () => {
  it('Returns 0 for empty derives', () => {
    const character = new Character('')
    character.sheet = sheetModel1
    character.stats = stats1
    expect(character.deriveStat('')).toBe(0)
  })

  it('Returns 0 for unknown derives', () => {
    const character = new Character('')
    character.sheet = sheetModel1
    character.stats = stats1
    expect(character.deriveStat('unknown')).toBe(0)
  })

  it('Returns value for primary stats', () => {
    const character = new Character('')
    character.sheet = sheetModel1
    character.stats = stats1
    expect(character.deriveStat('strength')).toBe(stats1.get('strength'))
  })

  it('Returns value for derived stats', () => {
    const character = new Character('')
    character.sheet = sheetModel1
    character.stats = stats1
    expect(character.deriveStat('strength bonus')).toBe(1)
  })
})
