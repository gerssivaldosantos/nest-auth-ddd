import {
  FakerDataBuilder,
  FieldDataFaker
} from '@core/@shared/domain/tests/faker.databuilder'

export const fields: FieldDataFaker[] = [
  {
    type: 'String',
    length: 100,
    nullable: false,
    description: 'Nome',
    dbname: 'name',
    name: 'name'
  },
  {
    type: 'String',
    length: 100,
    nullable: false,
    description: 'E-mail',
    dbname: 'email',
    name: 'email'
  },
  {
    type: 'String',
    length: 100,
    nullable: false,
    description: 'Senha',
    dbname: 'password',
    name: 'password'
  }
]
export class AuthFakerDatabuilder extends FakerDataBuilder {
  constructor() {
    super(fields)
  }

  buildValid(): any {
    super._buildValid()
    return this
  }

  buildInValid(invalidField: string[]): any {
    super._buildInValid(this.fields, invalidField)
    return this
  }
}
