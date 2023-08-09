import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IsOptional,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IsBoolean,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IsDate,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IsString,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IsNumber,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  MaxLength,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IsNotEmpty,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IsDateString,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IsUUID,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IsObject
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SignUpResultDto {
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

  @ApiProperty({ description: 'Token de Atualização' })
  @IsString()
  @MaxLength(255, {
    message: 'Token de Atualização deve ter no máximo 255 caracteres'
  })
  refreshToken: string

  @ApiProperty({ description: 'Token de acesso' })
  @MaxLength(255, {
    message: 'Token de Acesso deve ter no máximo 255 caracteres'
  })
  @IsString()
  accessToken: string
}
