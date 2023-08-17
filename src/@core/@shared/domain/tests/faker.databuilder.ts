import { faker } from '@faker-js/faker'
import { v4 as uuid } from 'uuid'

export type FieldDataFaker = {
  name: string
  dbname: string
  type: string
  length?: number
  value?: any
  description?: string
  primary?: boolean
  nullable?: boolean
  default?: any
}

export class FakerDataBuilder {
  get fields (): FieldDataFaker[] {
    return this.#fields
  }

  set fields (value: FieldDataFaker[]) {
    this.#fields = value
  }

  #fields: FieldDataFaker[] = []

  constructor (fields: FieldDataFaker[]) {
    this.fields = fields
  }

  _buildValid (): any {
    this.fields.forEach((field) => {
      this.setValidField(field)
    })
    return this
  }

  _buildInValid (
    fields: FieldDataFaker[],
    invalidField: string[],
  ): any {
    fields.forEach((field) => {
      invalidField.indexOf(field.name) > -1
        ? this.setInValidField(field)
        : this.setValidField(field)
    })
    return this
  }

  getRandomField (
    ignoredFields: string[] = [],
    invertIgnore = false
  ): FieldDataFaker {
    const fieldsWithoutIgnoreds = this.fields?.filter((item: FieldDataFaker) =>
      invertIgnore
        ? ignoredFields.includes(item.name)
        : !ignoredFields.includes(item.name)
    )
    return fieldsWithoutIgnoreds[
      Math.floor(Math.random() * fieldsWithoutIgnoreds.length)
    ]
  }

  setValidField (field: FieldDataFaker): any {
    const { name, type, length, value } = field
    switch (type.toLowerCase()) {
      case 'string':
        if (name === 'email') {
          this[name] = value || faker.internet.email()
        } else {
          this[name] = value || faker.random.alpha(length)
        }

        break
      case 'number':
        this[name] = value || Number(faker.random.numeric())
        break
      case 'date':
        this[name] = faker.date.soon(1).toISOString()
        break
      case 'boolean':
        this[name] = value || Math.random() < 0.5
        break
      case 'simple-json':
        this[name] = value || { id: 1 }
        break
      case 'uuid':
        this[name] = value || uuid()
        break
    }
    return this
  }

  setInValidField (field: FieldDataFaker): any {
    const { name, type, length, value } = field
    switch (type.toLowerCase()) {
      case 'string':
        this[name] = value || faker.random.alpha(length + 1)
        break
      case 'number':
        this[name] = value || 'invalidnumber'
        break
      case 'date':
        this[name] = value || 'dateinvalid'
        break
      case 'boolean':
        this[name] = value || 'invalidboolean'
        break
      case 'simple-json':
        this[name] = value || 'invalidjson'
        break
      case 'uuid':
        this[name] = value || faker.random.alpha(length)
        break
    }
    return this
  }
}
