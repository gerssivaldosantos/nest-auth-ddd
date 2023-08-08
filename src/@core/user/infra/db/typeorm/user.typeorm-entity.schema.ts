import {
  Entity,
  Column,
  PrimaryColumn,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ManyToOne,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  OneToMany,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ManyToMany,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  JoinColumn,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  JoinTable,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Relation
} from 'typeorm'
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IsOptional,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IsBoolean,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IsDateString,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IsString,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IsNumber,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  MaxLength,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Length,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IsNotEmpty,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IsUUID,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IsObject
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
import dotenv from 'dotenv'
import * as path from 'path'
if (process.env.NODE_ENV === 'test') {
  dotenv.config({
    path: path.resolve(process.cwd(), '.env.test')
  })
}
@Entity({ name: 'user' })
export class UserTypeOrmEntitySchema {
  @ApiProperty({
    description: 'ID',
    required: false
  })
  @Column({
    type: 'uuid',
    name: 'id',

    primary: true
  })
  @PrimaryColumn()
  @IsUUID()
  id: string

  @ApiProperty({
    description: 'Nome',
    required: false,
    maxLength: 100
  })
  @Column({
    type: 'varchar',
    name: 'name',
    nullable: false
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string

  @ApiProperty({
    description: 'E-mail',
    required: false,
    maxLength: 100
  })
  @Column({
    type: 'varchar',
    name: 'email',
    nullable: false
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  email: string

  @ApiProperty({
    description: 'Senha',
    required: false,
    maxLength: 100
  })
  @Column({
    type: 'varchar',
    name: 'password',
    nullable: false
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  password: string

  @ApiProperty({
    description: 'Token de Atualização',
    required: true,
    maxLength: 255
  })
  @Column({
    type: 'varchar',
    name: 'refresh_token',
    nullable: true
  })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  refreshToken: string

  @ApiProperty({
    description: 'Data de Expiração do Token de Atualização',
    required: true
  })
  @Column({
    type: process.env.DATABASE_TYPE === 'sqlite' ? 'datetime' : 'timestamp',
    name: 'refresh_token_expiration',
    nullable: true
  })
  @IsDateString()
  @IsOptional()
  refreshTokenExpiration: Date

  @ApiProperty({
    description: 'Data de criação',
    required: false
  })
  @Column({
    type: process.env.DATABASE_TYPE === 'sqlite' ? 'datetime' : 'timestamp',
    name: 'created_at',
    nullable: false
  })
  @IsDateString()
  @IsNotEmpty()
  createdAt: Date

  @ApiProperty({
    description: 'Data de atualização',
    required: true
  })
  @Column({
    type: process.env.DATABASE_TYPE === 'sqlite' ? 'datetime' : 'timestamp',
    name: 'updated_at',
    nullable: true
  })
  @IsDateString()
  @IsOptional()
  updatedAt: Date
}
