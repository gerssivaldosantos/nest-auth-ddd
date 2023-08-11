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
export type UserInput = {
  id: string

  name: string

  email: string

  password: string

  refreshToken?: string

  refreshTokenExpiration?: string

  createdAt: string

  updatedAt?: string
}

export default class UserEntity extends Entity {
  @ApiProperty({ description: 'ID' })
  @IsUUID()
  @IsOptional()
  id: string

  @ApiProperty({ description: 'Nome' })
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  name: string

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

  @ApiProperty({ description: 'Token de Atualização' })
  @IsString()
  @IsOptional()
  @MaxLength(255, {
    message: 'Token de Atualização deve ter no máximo 255 caracteres'
  })
  refreshToken: string | null

  @ApiProperty({ description: 'Data de criação' })
  @IsDateString()
  @IsNotEmpty({ message: 'Data de criação é obrigatório' })
  createdAt: string

  @ApiProperty({ description: 'Data de atualização' })
  @IsDateString()
  @IsOptional()
  updatedAt: string | null

  getPlainClass(): any {
    return UserEntity
  }

  async encryptPassword(): Promise<void> {
    this.password = await argon2.hash(this.password)
  }

  constructor(User: UserInput, notification: NotificationInterface) {
    super(notification, User?.id || null)
    this.name = User.name
    this.email = User.email
    this.password = User.password
    this.refreshToken = User?.refreshToken
    this.createdAt = User.createdAt
      ? this.dateToStringISO(User.createdAt)
      : this.dateToStringISO(new Date())
    this.updatedAt = this.dateToStringISO(new Date())
  }
}
