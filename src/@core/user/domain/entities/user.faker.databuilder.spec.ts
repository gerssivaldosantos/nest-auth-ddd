import { fields, UserFakerDatabuilder } from './user.faker.databuilder'

describe('UserFakerDataBuilder', () => {
  it('Should get defined filter', () => {
    const fakerFields = fields
    const builder = new UserFakerDatabuilder()
    expect(builder.fields).toMatchObject(fakerFields)
  })
})
