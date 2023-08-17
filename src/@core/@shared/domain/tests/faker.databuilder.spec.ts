import {
  FakerDataBuilder,
  FieldDataFaker
} from '@core/@shared/domain/tests/faker.databuilder'
import { describe, it, expect } from 'vitest'

const fields: FieldDataFaker[] = [
  { name: 'name', dbname: 'name', type: 'string', length: 80 },
  { name: 'email', dbname: 'email', type: 'string', length: 80 },
  { name: 'age', dbname: 'age', type: 'number' },
  { name: 'birthday', dbname: 'birthday', type: 'date' },
  { name: 'context', dbname: 'context', type: 'simple-json' },
  { name: 'active', dbname: 'active', type: 'boolean' },
  { name: 'uuid', dbname: 'id', type: 'uuid' }
]
describe('FakerDataBuilder', () => {
  it('Should create a valid data input', () => {
    const builder = new FakerDataBuilder(fields)
    const input = builder
      .setValidField({
        name: 'name',
        dbname: 'name',
        type: 'string',
        length: 30
      })
      .setValidField({
        name: 'email',
        dbname: 'email',
        type: 'string',
        length: 40
      })
    expect(input.name.length).toBeLessThanOrEqual(80)
    expect(input.email.length).toBeLessThanOrEqual(40)
  })

  it('Should create an invalid data input', () => {
    const builder = new FakerDataBuilder(fields)
    const input = builder
      .setValidField({
        name: 'name',
        dbname: 'name',
        type: 'string',
        length: 30
      })
      .setInValidField({
        name: 'email',
        dbname: 'email',
        type: 'string',
        length: 40
      })
    expect(input.name.length).toBeLessThanOrEqual(80)
    expect(input.email.length).toBeGreaterThan(40)
  })

  it('Should create a random valid data input', () => {
    const builder = new FakerDataBuilder(fields)
    const input = builder._buildValid()
    expect(input.name.length).toBeLessThanOrEqual(80)
    expect(input.email.length).toBeLessThanOrEqual(40)
  })

  it('Should create a random invalid data input', () => {
    const builder = new FakerDataBuilder(fields)
    const input = builder._buildInValid(fields, [
      'name',
      'email',
      'age',
      'birthday',
      'context',
      'active',
      'uuid'
    ])
    expect(input.name.length).toBeGreaterThan(80)
    expect(input.email.length).toBeGreaterThan(40)
    expect(input.age).toEqual('invalidnumber')
    expect(input.birthday).toEqual('dateinvalid')
  })

  it('Should return an random field name', () => {
    const builder = new FakerDataBuilder(fields)._buildValid()
    const fieldName = builder.getRandomField().name
    const fieldsName = Object.keys(builder)
    expect(fieldsName.indexOf(fieldName)).toBeGreaterThan(-1)
  })
})
