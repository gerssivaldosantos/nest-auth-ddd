import UserEntity from '@core/user/domain/entities/user.entity'
import Notification from '@core/@shared/domain/notification/notification'
import { UserTypeOrmRepository } from '@core/user/infra/db/typeorm/user.typeorm-repository'
import { DataSource } from 'typeorm'
import { TypeOrmFactory } from '@core/@shared/infra/db/typeorm/datasource'
import { SearchParams } from '@core/@shared/domain/repository/search-params.repository'
import { ParserCondition } from '@core/@shared/infra/db/typeorm/parser-condition'
import { FilterCondition, FilterOperator } from '@core/@shared/infra/types'
import { UserFakerDatabuilder } from '@core/user/domain/entities/user.faker.databuilder'
import NotificationError from '@core/@shared/domain/notification/notification.error'
import { v4 as uuid } from 'uuid'
/* TODO: Ao atualizar para as versões 0.3.16 e 0.3.17, os testes com find estão com problema
 *   no timezone da data */
/* TODO: O erro do timezone voltou a ocorrer, mesmo na versão 0.3.15 (timezone) */
import { createUserRelations } from '@core/user/domain/repository/user.test.helper'
import { FieldDataFaker } from '@core/@shared/domain/tests/faker.databuilder'

const builder = new UserFakerDatabuilder()

describe('User Repository', () => {
  let dataSource: DataSource
  let notification: Notification
  const inputData = new UserFakerDatabuilder().buildValid()

  const typeOrmParser = new ParserCondition()

  beforeEach(async () => {
    // Factory for creating a TypeOrm DataSource
    dataSource = await TypeOrmFactory.getDataSourceInstance('.env.test')
    notification = new Notification()
  })

  afterEach(() => {
    notification.clearErrors()
    return dataSource.destroy()
  })
  it('Should create user', async () => {
    const inputData = builder.buildValid()
    const repository = new UserTypeOrmRepository(dataSource, notification)
    const relations = await createUserRelations(dataSource)
    const entity = new UserEntity(
      {
        ...inputData,
        ...relations
      },
      notification
    )
    const inserted: UserEntity = await repository.insert(entity)
    expect(inserted).toBeInstanceOf(UserEntity)
    const resultUser = inserted.toJSON()
    expect(resultUser).toMatchObject({
      ...inputData,
      ...relations
    })
  })

  it('Should get an error when inserting an invalid user', async () => {
    for (const { name: fieldName } of builder.fields) {
      const relations = createUserRelations(dataSource)
      const inputInvalidData = {
        ...builder.buildInValid([fieldName]),
        ...relations
      }
      const entity = new UserEntity(inputInvalidData, notification)
      const repository = new UserTypeOrmRepository(dataSource, notification)
      await expect(repository.insert(entity)).rejects.toThrow(NotificationError)
    }
  })

  it('Should update user', async () => {
    const inputData = builder.buildValid()
    const relations = await createUserRelations(dataSource)

    const entity = new UserEntity(
      {
        ...inputData,
        ...relations
      },
      notification
    )
    const repository = new UserTypeOrmRepository(dataSource, notification)
    await repository.insert(entity)

    const fieldNames = entity
      .getFilledProperties()
      .filter(
        (field) =>
          ![
            'updatedAt',
            'createdAt',
            'password',
            'refreshToken',
            'refreshTokenExpiration'
          ].includes(field)
      )

    const builder2 = new UserFakerDatabuilder().buildValid()
    const relations2 = await createUserRelations(dataSource)
    const entity2 = new UserEntity(
      {
        ...builder2,
        ...relations2
      },
      notification
    )
    await repository.insert(entity2)
    for (const fieldName of fieldNames) {
      entity2[fieldName] = entity[fieldName]
      const updated: any = await repository.update(entity2)
      expect(updated[fieldName]).toEqual(entity2[fieldName])
      expect(updated.id).toEqual(entity2.id)
    }
  })

  it('Should get an error updating an invalid user', async () => {
    const inputData = builder.buildValid()
    const relations = await createUserRelations(dataSource)
    const entity = new UserEntity(
      {
        ...inputData,
        ...relations
      },
      notification
    )
    const repository = new UserTypeOrmRepository(dataSource, notification)
    await repository.insert(entity)

    const fieldNames = entity
      .getFilledProperties()
      .filter(
        (field) =>
          ![
            'updatedAt',
            'createdAt',
            'password',
            'refreshToken',
            'refreshTokenExpiration'
          ].includes(field)
      )
    for (const fieldName of fieldNames) {
      const inputData2 = new UserFakerDatabuilder().buildInValid([fieldName])
      const entity2 = new UserEntity(
        {
          ...inputData2
        },
        notification
      )

      await expect(repository.update(entity2)).rejects.toThrow()
    }
  })

  it('Should find user by id', async () => {
    const inputData = builder.buildValid()
    const relations = await createUserRelations(dataSource)
    const entity = new UserEntity(
      {
        ...inputData,
        ...relations
      },
      notification
    )
    const repository = new UserTypeOrmRepository(dataSource, notification)
    await repository.insert(entity)

    const foundUser = await repository.findById(inputData.id)
    expect(foundUser.id).toEqual(entity.id)
  })

  it('Should return a notification error when not found user', async () => {
    const repository = new UserTypeOrmRepository(dataSource, notification)
    const foundUser = await repository.findById(uuid())
    expect(repository.notification.hasError()).toBeTruthy()
    expect(repository.notification.getPlainMessageErrors()).toEqual(
      'Could not find by id'
    )
    expect(foundUser).toBeNull()
  })

  it('Should return true when successful deleting user', async () => {
    const relations = await createUserRelations(dataSource)
    const entity = new UserEntity(
      {
        ...inputData,
        ...relations
      },
      notification
    )
    const repository = new UserTypeOrmRepository(dataSource, notification)
    await repository.insert(entity)

    const deleted = await repository.delete(entity.id)
    expect(deleted).toBeTruthy()
  })

  it('Should return false when not deleting user', async () => {
    const repository = new UserTypeOrmRepository(dataSource, notification)

    const deleted = await repository.delete(uuid())
    expect(deleted).toBeFalsy()
  })

  it('Should return an error when id is null or blank ', async () => {
    const repository = new UserTypeOrmRepository(dataSource, notification)
    await expect(repository.delete(null)).rejects.toThrow('id is required')
  })

  /* it('Should found one User', async () => {
    const relations = await createUserRelations(dataSource)
    const entity = new UserEntity(
      {
        ...inputData,
        ...relations
      },
      notification
    )
    const repository = new UserTypeOrmRepository(dataSource, notification)
    const search: UserEntity = await repository.insert(entity)
    expect(search).toBeInstanceOf(UserEntity)

    const searchParams = new SearchParams({}, typeOrmParser)
    const searchResult = await repository.search(searchParams)
    expect(searchResult.items.length).toEqual(1)
  }) */

  it('Should found user when search by field', async () => {
    const repository = new UserTypeOrmRepository(dataSource, notification)

    const relations = await createUserRelations(dataSource)

    const firstEntity = new UserEntity(
      {
        ...builder.buildValid(),
        ...relations
      },
      notification
    )
    const fieldNames = firstEntity
      .getFilledProperties()
      .filter(
        (field) =>
          ![
            'updatedAt',
            'createdAt',
            'password',
            'refreshToken',
            'refreshTokenExpiration'
          ].includes(field)
      )

    await repository.insert(firstEntity)

    for (let i = 0; i < 5; i++) {
      const entity = new UserEntity(
        {
          ...builder.buildValid(),
          ...relations
        },
        notification
      )
      await repository.insert(entity)
    }
    for (const fieldName of fieldNames) {
      const searchParams = new SearchParams(
        {
          filter: [{ [fieldName]: firstEntity[fieldName] }]
        },
        typeOrmParser
      )
      const { items } = await repository.search(searchParams)
      expect(items.length).toBeGreaterThan(0)
      items.forEach((item) => {
        expect(item[fieldName]).toEqual(firstEntity[fieldName])
      })
    }
  })

  it('Should find and found  user when search by field using "AND" operator', async () => {
    const repository = new UserTypeOrmRepository(dataSource, notification)

    const fieldsIgnore: string[] = [
      'updatedAt',
      'createdAt',
      'password',
      'refreshToken',
      'refreshTokenExpiration'
    ]

    const fields = builder.fields.filter(
      (field) => !fieldsIgnore.includes(field.name)
    )

    const relations = await createUserRelations(dataSource)

    const firstEntity = new UserEntity(
      {
        ...builder.buildValid(),
        ...relations
      },
      notification
    )

    await repository.insert(firstEntity)

    for (let i = 0; i < 5; i++) {
      const entity = new UserEntity(
        {
          ...builder.buildValid(),
          ...relations
        },
        notification
      )
      await repository.insert(entity)
    }
    const filterCondition: FilterCondition = fields.reduce(
      (acumulator, field: FieldDataFaker) => {
        return Object.assign(acumulator, {
          [field.name]: { [FilterOperator.Equal]: firstEntity[field.name] }
        })
      },
      {}
    )
    const searchParams = new SearchParams(
      {
        filter: filterCondition
      },
      typeOrmParser
    )
    const { items } = await repository.search(searchParams)
    expect(items.length).toBeGreaterThan(0)
    for (const item of items) {
      for (const field of fields) {
        expect(item[field.name]).toEqual(firstEntity[field.name])
      }
    }
  })

  it('Should find and found user when searching by field using "OR" operator', async () => {
    const repository = new UserTypeOrmRepository(dataSource, notification)

    const fieldsIgnore = [
      'updatedAt',
      'createdAt',
      'password',
      'refreshToken',
      'refreshTokenExpiration'
    ]

    const fields = builder.fields.filter(
      (field) => !fieldsIgnore.includes(field.name)
    )

    const relations = await createUserRelations(dataSource)

    const firstEntity = new UserEntity(
      {
        ...builder.buildValid(),
        ...relations
      },
      notification
    )

    await repository.insert(firstEntity)

    for (let i = 0; i < 5; i++) {
      const entity = new UserEntity(
        {
          ...builder.buildValid(),
          ...relations
        },
        notification
      )
      await repository.insert(entity)
    }

    const filterCondition: FilterCondition = fields.map(
      (field: FieldDataFaker) => {
        return {
          [field.name]: { [FilterOperator.Equal]: firstEntity[field.name] }
        }
      }
    )

    const searchParams = new SearchParams(
      {
        filter: filterCondition
      },
      typeOrmParser
    )

    const { items } = await repository.search(searchParams)
    expect(items.length).toBeGreaterThan(0)

    for (const item of items) {
      expect(
        fields.some((field) => item[field.name] === firstEntity[field.name])
      ).toBeTruthy()
    }
  })

  it('Should find and found user when searching by field using "AND" and "OR" operators', async () => {
    const repository = new UserTypeOrmRepository(dataSource, notification)

    const fieldsIgnore = [
      'updatedAt',
      'createdAt',
      'password',
      'refreshToken',
      'refreshTokenExpiration'
    ]

    const fields = builder.fields.filter(
      (field) => !fieldsIgnore.includes(field.name)
    )

    const relations = await createUserRelations(dataSource)

    const firstEntity = new UserEntity(
      {
        ...builder.buildValid(),
        ...relations
      },
      notification
    )

    await repository.insert(firstEntity)

    const relations2 = await createUserRelations(dataSource)

    const secondEntity = new UserEntity(
      {
        ...builder.buildValid(),
        ...relations2
      },
      notification
    )

    await repository.insert(secondEntity)

    for (let i = 0; i < 4; i++) {
      const entity = new UserEntity(
        {
          ...builder.buildValid(),
          ...relations
        },
        notification
      )
      await repository.insert(entity)
    }

    const filterCondition: FilterCondition = [
      fields.reduce((acumulator, field: FieldDataFaker) => {
        return Object.assign(acumulator, {
          [field.name]: { [FilterOperator.Equal]: firstEntity[field.name] }
        })
      }, {}),
      fields.reduce((acumulator, field: FieldDataFaker) => {
        return Object.assign(acumulator, {
          [field.name]: { [FilterOperator.Equal]: secondEntity[field.name] }
        })
      }, {})
    ]

    const searchParams = new SearchParams(
      {
        filter: filterCondition
      },
      typeOrmParser
    )

    const { items } = await repository.search(searchParams)
    expect(items.length).toBeGreaterThan(0)

    items.forEach((item) => {
      expect(
        !fields.filter((field) => item[field.name] !== firstEntity[field.name])
          .length ||
          !fields.filter(
            (field) => item[field.name] !== secondEntity[field.name]
          ).length
      ).toBeTruthy()
    })
  })

  it('Should execute a RAW SQL and return a record', async () => {
    const inputValid = builder.buildValid()
    const relations = await createUserRelations(dataSource)
    const field = builder.getRandomField([
      'updatedAt',
      'createdAt',
      'password',
      'refreshToken',
      'refreshTokenExpiration'
    ])
    const firstEntity = new UserEntity(
      {
        ...inputValid,
        ...relations
      },
      notification
    )
    const repository = new UserTypeOrmRepository(dataSource, notification)

    await repository.insert(firstEntity)
    for (let i = 0; i < 10; i++) {
      const inputData = new UserFakerDatabuilder().buildValid()
      const relations = await createUserRelations(dataSource)
      const entity = new UserEntity(
        {
          ...inputData,
          ...relations
        },
        notification
      )
      await repository.insert(entity)
    }
    const fieldValue =
      field.type !== 'number'
        ? `'${firstEntity[field.name]}'`
        : firstEntity[field.name]

    const searchResult = await repository.executeSQL(
      `select * from "user" where ${field.dbname}=${fieldValue}`
    )
    expect(searchResult.length).toBeGreaterThan(0)
  })
})
