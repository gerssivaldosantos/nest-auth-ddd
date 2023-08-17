import NotificationInterface from '@core/@shared/domain/notification/notification.interface'
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IsEmail,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IsNotEmpty,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IsOptional,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IsString,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  MaxLength,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  MinLength,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IsNumber,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IsBoolean,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IsDateString,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IsUUID,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IsObject
} from 'class-validator'
import { Entity } from '@core/@shared/domain/entity/entity'
import { ApiProperty } from '@nestjs/swagger'
import * as argon2 from 'argon2'

export type AuthInput = {

  id:string

  email:string

  name:string

  password?:string

  refreshToken?:string
}

export default class AuthEntity extends Entity {
@ApiProperty({ description: 'ID' })
@IsUUID()
@IsOptional()
  id: string

@ApiProperty({ description: 'E-mail' })
@IsString()
@IsNotEmpty({ message: 'E-mail é obrigatório' })
@MaxLength(150, { message: 'E-mail deve ter no máximo 150 caracteres' })
  email: string

@ApiProperty({ description: 'Nome' })
@IsString()
@IsNotEmpty({ message: 'Nome é obrigatório' })
@MaxLength(120, { message: 'Nome deve ter no máximo 120 caracteres' })
  name: string

@ApiProperty({ description: 'Senha' })
@IsString()
@IsOptional()
@MaxLength(80, { message: 'Senha deve ter no máximo 80 caracteres' })
  password: string | null

@ApiProperty({ description: 'Token de Atualização' })
@IsString()
@IsOptional()
@MaxLength(40, { message: 'Token de Atualização deve ter no máximo 40 caracteres' })
  refreshToken: string | null

getPlainClass (): any {
  return AuthEntity
}

async encryptPassword () {
  this.password = await argon2.hash(this.password)
}

constructor (Auth: AuthInput, notification: NotificationInterface) {
  super(notification, Auth?.id || null)

  this.id = Auth.id
  this.email = Auth.email
  this.name = Auth.name
  this.password = Auth?.password
  this.refreshToken = Auth?.refreshToken
}
}
