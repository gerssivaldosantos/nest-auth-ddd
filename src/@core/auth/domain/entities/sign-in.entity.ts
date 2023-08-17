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
export type SignInInput = {
  id: string
  email: string
  password: string
}

export default class SignInEntity extends Entity {
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

  getPlainClass (): any {
    return SignInEntity
  }

  async encryptPassword (): Promise<void> {
    this.password = await argon2.hash(this.password)
  }

  constructor (SignIn: SignInInput, notification: NotificationInterface) {
    super(notification, SignIn?.id || null)
    this.email = SignIn.email
    this.password = SignIn.password
  }
}
