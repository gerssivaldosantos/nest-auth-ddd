import { fields, AuthFakerDatabuilder } from './auth.faker.databuilder'

describe('AuthFakerDataBuilder', () => {
  it('Should get defined filter', () => {
    const fakerFields = fields
    const builder = new AuthFakerDatabuilder()
    expect(builder.fields).toMatchObject(fakerFields)
  })
})
