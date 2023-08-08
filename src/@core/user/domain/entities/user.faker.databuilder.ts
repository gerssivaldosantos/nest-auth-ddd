import {
  FakerDataBuilder,
  FieldDataFaker
} from '@core/@shared/domain/tests/faker.databuilder'

export const fields: FieldDataFaker[] = [
  {
    type: 'Uuid',
    primary: true,
    nullable: false,
    description: 'ID',
    dbname: 'id',
    name: 'id'
  },
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
  },
  {
    type: 'String',
    length: 255,
    nullable: true,
    description: 'Token de Atualização',
    dbname: 'refresh_token',
    name: 'refreshToken'
  },
  {
    type: 'Date',
    nullable: true,
    description: 'Data de Expiração do Token de Atualização',
    dbname: 'refresh_token_expiration',
    name: 'refreshTokenExpiration'
  }
]
export class UserFakerDatabuilder extends FakerDataBuilder {
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
