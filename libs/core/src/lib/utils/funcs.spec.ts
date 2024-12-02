import { expandObject, mergeObject } from './funcs'

describe('mergeObject()', () => {
  it('merges objects', () => {
    expect(mergeObject({ id: 1 }, { name: 'test' })).toEqual({
      id: 1,
      name: 'test',
    })
  })
})

describe('expandObject()', () => {
  const data = {
    user: {
      id: 1,
      name: 'test',
    },
    session: {
      session_id: 123,
    },
  }

  it('expands objects with string keys', () => {
    expect(expandObject(data)).toEqual(data)
  })

  it('expands objects with number keys', () => {
    expect(
      expandObject({
        0: {
          test: {
            keyy: 'test',
          },
        },
        2: {
          supertest: {
            keyy: 'test',
          },
        },
      })
    ).toEqual({
      0: {
        test: {
          keyy: 'test',
        },
      },
      2: {
        supertest: {
          keyy: 'test',
        },
      },
    })
  })
})
