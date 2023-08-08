import { EntitySchema } from 'typeorm'
import { Entity } from '@core/@shared/domain/entity/entity'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator'
import NotificationInterface from '@core/@shared/domain/notification/notification.interface'

export class TestEntity extends Entity {
  @IsNotEmpty({
    message: 'Nome é obrigatório'
  })
  @IsString({
    message: 'Nome deve ser um texto'
  })
  @MinLength(3, {
    message: 'Nome deve ter pelo menos 3 letras'
  })
  @MaxLength(80, {
    message: 'Nome deve ter no máximo 80 caracteres'
  })
  name: string

  @IsEmail(
    {},
    {
      message: 'Email inválido'
    }
  )
  @MaxLength(120, {
    message: 'E-mail deve ter no máximo 120 caracteres'
  })
  @IsOptional()
  email: string | null

  getPlainClass(): any {
    return TestEntity
  }

  constructor(user: any, notification: NotificationInterface) {
    super(notification, user?.id || null)
    this.name = user?.name
    this.email = user?.email
  }
}

export const TestEntitySchema = new EntitySchema<TestEntity>({
  name: 'test',
  columns: {
    id: {
      type: String,
      primary: true,
      nullable: false,
      length: 36
    },
    name: {
      type: String,
      length: 80,
      nullable: false
    },
    email: {
      type: String,
      length: 120
    }
  }
})
