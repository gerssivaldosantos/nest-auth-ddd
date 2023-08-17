import { fields, AuthFakerDatabuilder } from './auth.faker.databuilder'
import { describe, it, expect } from 'vitest'

describe('AuthFakerDataBuilder', () => {
  it('Should get defined filter', () => {
    const fakerFields = fields
    const builder = new AuthFakerDatabuilder()
    expect(builder.fields).toMatchObject(fakerFields)
  })
})
