import AuthEntity from '@core/auth/domain/entities/auth.entity'
import Notification from '@core/@shared/domain/notification/notification'
import { AuthTypeOrmRepository } from '@core/auth/infra/db/typeorm/auth.typeorm-repository'
import { DataSource } from 'typeorm'
import { TypeOrmFactory } from '@core/@shared/infra/db/typeorm/datasource'
import { SearchParams } from '@core/@shared/domain/repository/search-params.repository'
import { ParserCondition } from '@core/@shared/infra/db/typeorm/parser-condition'
import { FilterCondition, FilterOperator } from '@core/@shared/infra/types'
import { AuthFakerDatabuilder } from '@core/auth/domain/entities/auth.faker.databuilder'
import NotificationError from '@core/@shared/domain/notification/notification.error'
import { v4 as uuid } from 'uuid'
/* TODO: Ao atualizar para as versões 0.3.16 e 0.3.17, os testes com find estão com problema
 *   no timezone da data */
/* TODO: O erro do timezone voltou a ocorrer, mesmo na versão 0.3.15 (timezone) */
import { createAuthRelations } from '@core/auth/domain/repository/auth.test.helper'
import { FieldDataFaker } from '@core/@shared/domain/tests/faker.databuilder'

const builder = new AuthFakerDatabuilder()

describe('Auth Repository', () => {
  let dataSource: DataSource
  let notification: Notification
  const inputData = new AuthFakerDatabuilder().buildValid()

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
  it('Should create auth', async () => {
    const inputData = builder.buildValid()
    const repository = new AuthTypeOrmRepository(dataSource, notification)
    const relations = await createAuthRelations(dataSource)
    const entity = new AuthEntity(
      {
        ...inputData,
        ...relations
      },
      notification
    )
    const inserted: AuthEntity = await repository.insert(entity)
    expect(inserted).toBeInstanceOf(AuthEntity)
    const resultAuth = inserted.toJSON()
    expect(resultAuth).toMatchObject({
      ...inputData,
      ...relations
    })
  })

  it('Should get an error when inserting an invalid auth', async () => {
    for (const { name: fieldName } of builder.fields) {
      const relations = createAuthRelations(dataSource)
      const inputInvalidData = {
        ...builder.buildInValid([fieldName]),
        ...relations
      }
      const entity = new AuthEntity(inputInvalidData, notification)
      const repository = new AuthTypeOrmRepository(dataSource, notification)
      await expect(repository.insert(entity)).rejects.toThrow(NotificationError)
    }
  })

  it('Should update auth', async () => {
    const inputData = builder.buildValid()
    const relations = await createAuthRelations(dataSource)

    const entity = new AuthEntity(
      {
        ...inputData,
        ...relations
      },
      notification
    )
    const repository = new AuthTypeOrmRepository(dataSource, notification)
    await repository.insert(entity)

    const fieldNames = entity
      .getFilledProperties()
      .filter((field) => ![].includes(field))

    const builder2 = new AuthFakerDatabuilder().buildValid()
    const relations2 = await createAuthRelations(dataSource)
    const entity2 = new AuthEntity(
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

  it('Should get an error updating an invalid auth', async () => {
    const inputData = builder.buildValid()
    const relations = await createAuthRelations(dataSource)
    const entity = new AuthEntity(
      {
        ...inputData,
        ...relations
      },
      notification
    )
    const repository = new AuthTypeOrmRepository(dataSource, notification)
    await repository.insert(entity)

    const fieldNames = entity
      .getFilledProperties()
      .filter((field) => ![].includes(field))
    for (const fieldName of fieldNames) {
      const inputData2 = new AuthFakerDatabuilder().buildInValid([fieldName])
      const entity2 = new AuthEntity(
        {
          ...inputData2
        },
        notification
      )

      await expect(repository.update(entity2)).rejects.toThrow()
    }
  })

  it('Should find auth by id', async () => {
    const inputData = builder.buildValid()
    const relations = await createAuthRelations(dataSource)
    const entity = new AuthEntity(
      {
        ...inputData,
        ...relations
      },
      notification
    )
    const repository = new AuthTypeOrmRepository(dataSource, notification)
    await repository.insert(entity)

    const foundAuth = await repository.findById(inputData.id)
    expect(foundAuth.id).toEqual(entity.id)
  })

  it('Should return a notification error when not found auth', async () => {
    const repository = new AuthTypeOrmRepository(dataSource, notification)
    const foundAuth = await repository.findById(uuid())
    expect(repository.notification.hasError()).toBeTruthy()
    expect(repository.notification.getPlainMessageErrors()).toEqual(
      'Could not find by id'
    )
    expect(foundAuth).toBeNull()
  })

  it('Should return true when successful deleting auth', async () => {
    const relations = await createAuthRelations(dataSource)
    const entity = new AuthEntity(
      {
        ...inputData,
        ...relations
      },
      notification
    )
    const repository = new AuthTypeOrmRepository(dataSource, notification)
    await repository.insert(entity)

    const deleted = await repository.delete(entity.id)
    expect(deleted).toBeTruthy()
  })

  it('Should return false when not deleting auth', async () => {
    const repository = new AuthTypeOrmRepository(dataSource, notification)

    const deleted = await repository.delete(uuid())
    expect(deleted).toBeFalsy()
  })

  it('Should return an error when id is null or blank ', async () => {
    const repository = new AuthTypeOrmRepository(dataSource, notification)
    await expect(repository.delete(null)).rejects.toThrow('id is required')
  })

  /* it('Should found one Auth', async () => {
    const relations = await createAuthRelations(dataSource)
    const entity = new AuthEntity(
      {
        ...inputData,
        ...relations
      },
      notification
    )
    const repository = new AuthTypeOrmRepository(dataSource, notification)
    const search: AuthEntity = await repository.insert(entity)
    expect(search).toBeInstanceOf(AuthEntity)

    const searchParams = new SearchParams({}, typeOrmParser)
    const searchResult = await repository.search(searchParams)
    expect(searchResult.items.length).toEqual(1)
  }) */

  it('Should found auth when search by field', async () => {
    const repository = new AuthTypeOrmRepository(dataSource, notification)

    const relations = await createAuthRelations(dataSource)

    const firstEntity = new AuthEntity(
      {
        ...builder.buildValid(),
        ...relations
      },
      notification
    )
    const fieldNames = firstEntity
      .getFilledProperties()
      .filter((field) => ![].includes(field))

    await repository.insert(firstEntity)

    for (let i = 0; i < 5; i++) {
      const entity = new AuthEntity(
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

  it('Should find and found  auth when search by field using "AND" operator', async () => {
    const repository = new AuthTypeOrmRepository(dataSource, notification)

    const fieldsIgnore: string[] = []

    const fields = builder.fields.filter(
      (field) => !fieldsIgnore.includes(field.name)
    )

    const relations = await createAuthRelations(dataSource)

    const firstEntity = new AuthEntity(
      {
        ...builder.buildValid(),
        ...relations
      },
      notification
    )

    await repository.insert(firstEntity)

    for (let i = 0; i < 5; i++) {
      const entity = new AuthEntity(
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

  it('Should find and found auth when searching by field using "OR" operator', async () => {
    const repository = new AuthTypeOrmRepository(dataSource, notification)

    const fieldsIgnore = []

    const fields = builder.fields.filter(
      (field) => !fieldsIgnore.includes(field.name)
    )

    const relations = await createAuthRelations(dataSource)

    const firstEntity = new AuthEntity(
      {
        ...builder.buildValid(),
        ...relations
      },
      notification
    )

    await repository.insert(firstEntity)

    for (let i = 0; i < 5; i++) {
      const entity = new AuthEntity(
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

  it('Should find and found auth when searching by field using "AND" and "OR" operators', async () => {
    const repository = new AuthTypeOrmRepository(dataSource, notification)

    const fieldsIgnore = []

    const fields = builder.fields.filter(
      (field) => !fieldsIgnore.includes(field.name)
    )

    const relations = await createAuthRelations(dataSource)

    const firstEntity = new AuthEntity(
      {
        ...builder.buildValid(),
        ...relations
      },
      notification
    )

    await repository.insert(firstEntity)

    const relations2 = await createAuthRelations(dataSource)

    const secondEntity = new AuthEntity(
      {
        ...builder.buildValid(),
        ...relations2
      },
      notification
    )

    await repository.insert(secondEntity)

    for (let i = 0; i < 4; i++) {
      const entity = new AuthEntity(
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
    const relations = await createAuthRelations(dataSource)
    const field = builder.getRandomField([])
    const firstEntity = new AuthEntity(
      {
        ...inputValid,
        ...relations
      },
      notification
    )
    const repository = new AuthTypeOrmRepository(dataSource, notification)

    await repository.insert(firstEntity)
    for (let i = 0; i < 10; i++) {
      const inputData = new AuthFakerDatabuilder().buildValid()
      const relations = await createAuthRelations(dataSource)
      const entity = new AuthEntity(
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
      `select * from "auth" where ${field.dbname}=${fieldValue}`
    )
    expect(searchResult.length).toBeGreaterThan(0)
  })
})
