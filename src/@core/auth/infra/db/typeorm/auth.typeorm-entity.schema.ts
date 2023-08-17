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
  Relation,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Index
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
/*
import { RoleTypeOrmEntitySchema } from '@core/role/infra/db/typeorm/role.typeorm-entity.schema'
import { AuthRoleTypeOrmEntitySchema } from '@core/auth-role/infra/db/typeorm/auth-role.typeorm-entity.schema'
*/

import { ApiProperty } from '@nestjs/swagger';
(async function () {
// eslint-disable-next-line @typescript-eslint/no-var-requires
  const dotenv = require('dotenv')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const path = require('path')
  if (process.env.NODE_ENV === 'test') {
    dotenv.config({
      path: path.resolve(process.cwd(), '.env.test')
    })
  } else {
    dotenv.config({
      path: path.resolve(process.cwd(), '.env')
    })
  }
}())
@Entity({ name: 'auth' })
export class AuthTypeOrmEntitySchema {
  @ApiProperty({
    description: 'ID',
    required: false,

  })
  @Column({
    type: 'uuid',
    name: 'id',

    primary: true,

  })
  @PrimaryColumn()

  @IsUUID()
    id: string

  @ApiProperty({
    description: 'E-mail',
    required: false,
    maxLength: 150,
  })
  @Column({
    type: 'varchar',
    name: 'email',
    nullable: false,

  })

  @Index('idx_auth_email', { unique: true })

  @IsString()
  @IsNotEmpty()
  @Length(1, 150)
    email: string

  @ApiProperty({
    description: 'Nome',
    required: false,
    maxLength: 120,
  })
  @Column({
    type: 'varchar',
    name: 'name',
    nullable: false,

  })

  @IsString()
  @IsNotEmpty()
  @Length(1, 120)
    name: string

  @ApiProperty({
    description: 'Senha',
    required: true,
    maxLength: 80,
  })
  @Column({
    type: 'varchar',
    name: 'password',
    nullable: true,

  })

  @IsString()
  @IsOptional()
  @Length(1, 80)
    password: string

  @ApiProperty({
    description: 'Token de Atualização',
    required: true,
    maxLength: 40,
  })
  @Column({
    type: 'varchar',
    name: 'refresh_token',
    nullable: true,

  })

  @IsString()
  @IsOptional()
  @Length(1, 40)
    refreshToken: string

  /* @ManyToMany(() => RoleTypeOrmEntitySchema)
  @JoinTable()
    role: Relation<RoleTypeOrmEntitySchema>[]

  @OneToMany(() => AuthRoleTypeOrmEntitySchema, (authRole) => authRole.auth)
    authRole: Relation<AuthRoleTypeOrmEntitySchema>[] */
}
