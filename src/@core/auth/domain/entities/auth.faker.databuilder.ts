import {
  FakerDataBuilder,
  FieldDataFaker
} from '@core/@shared/domain/tests/faker.databuilder'

export const fields: FieldDataFaker[] = [{ type: 'Uuid', nullable: false, description: 'ID', primary: true, dbname: 'id', name: 'id' }, { type: 'String', length: 150, nullable: false, description: 'E-mail', dbname: 'email', name: 'email' }, { type: 'String', length: 120, nullable: false, description: 'Nome', dbname: 'name', name: 'name' }, { type: 'String', length: 80, nullable: true, description: 'Senha', dbname: 'password', name: 'password' }, { type: 'String', length: 40, nullable: true, description: 'Token de Atualização', dbname: 'refresh_token', name: 'refreshToken' }]
export class AuthFakerDatabuilder extends FakerDataBuilder {
  constructor () {
    super(fields)
  }

  buildValid (): any {
    super._buildValid()
    return this
  }

  buildInValid (invalidField: string[]): any {
    super._buildInValid(this.fields, invalidField)
    return this
  }
}
