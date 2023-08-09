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
import { ApiProperty } from '@nestjs/swagger'
import { Entity } from '@core/@shared/domain/entity/entity'

export type AuthInput = {
  email: string

  password: string
}

export default class AuthEntity extends Entity {
  @ApiProperty({ description: 'E-mail' })
  @IsString()
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @MaxLength(100, { message: 'E-mail deve ter no máximo 100 caracteres' })
  email: string

  @ApiProperty({ description: 'Senha' })
  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatório' })
  @MaxLength(100, { message: 'Senha deve ter no máximo 100 caracteres' })
  password: string

  getPlainClass(): any {
    return AuthEntity
  }

  constructor(Auth: AuthInput, notification: NotificationInterface) {
    super(notification, undefined)
    this.email = Auth.email
    this.password = Auth.password
  }
}
