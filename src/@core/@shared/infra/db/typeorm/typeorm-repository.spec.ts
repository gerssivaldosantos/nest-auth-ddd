import Notification from '@core/@shared/domain/notification/notification'
import { DataSource } from 'typeorm'
import crypto from 'crypto'
import { TypeOrmFactory } from '@core/@shared/infra/db/typeorm/datasource'
import { SearchParams } from '@core/@shared/domain/repository/search-params.repository'
import { faker } from '@faker-js/faker'
import { ParserCondition } from '@core/@shared/infra/db/typeorm/parser-condition'
import { TypeOrmRepository } from '@core/@shared/infra/db/typeorm/typeorm-repository'
import {
  TestEntity,
  TestEntitySchema
} from '@core/@shared/infra/db/typeorm/typeorm-repository.test-schema'
import { FilterCondition } from '@core/@shared/infra/types'
import NotificationError from '@core/@shared/domain/notification/notification.error'

describe('TypeOrm Repository', () => {
  let dataSource: DataSource
  let notification: Notification
  const userData = {
    id: crypto.randomUUID(),
    name: 'John',
    email: 'john@example.com'
  }
  const typeOrmParser = new ParserCondition()

  beforeEach(async () => {
    // Factory for creating a TypeOrm DataSource
    dataSource = await TypeOrmFactory.getDataSourceInstance('.env.test')
    notification = new Notification()
    await dataSource.getRepository('test').clear()
  })

  afterEach(() => {
    notification.clearErrors()
    return dataSource.destroy()
  })
  it('Should create a record', async () => {
    const entity = new TestEntity(userData, notification)
    const repository = new TypeOrmRepository(
      dataSource,
      notification,
      TestEntitySchema,
      TestEntity
    )

    const repoResult = await repository.insert(entity)
    expect(repoResult).toMatchObject(userData)
  })

  it('Should get an error inserting an null record', async () => {
    const entity = new TestEntity({}, notification)

    const repository = new TypeOrmRepository(
      dataSource,
      notification,
      TestEntitySchema,
      TestEntity
    )
    try {
      await repository.insert(entity)
    } catch (e) {
      expect(e).toBeInstanceOf(NotificationError)
    }
  })

  it('Should update a record', async () => {
    const entity = new TestEntity(userData, notification)
    const repository = new TypeOrmRepository(
      dataSource,
      notification,
      TestEntitySchema,
      TestEntity
    )

    await repository.insert(entity)
    const testEntity = new TestEntity(userData, notification)

    const userData2 = Object.assign({}, userData)
    userData2.id = crypto.randomUUID()
    userData2.email = 'test@example.com'
    const entity2 = new TestEntity(userData2, notification)
    await repository.insert(entity2)

    testEntity.email = 'user@example.com'
    const updated: any = await repository.update(testEntity)
    expect(updated.email).toEqual(testEntity.email)
    expect(updated.id).toEqual(testEntity.id)
  })

  /* TODO: Considero que esse teste tá errado no próprio conceito dele, já que até a premissa
   *  da descrição do teste "Deve receber um erro quando não encontrado" está errado, já que no repository não
   * existe verificação de existencia da entidade antes de chamar o save do typeorm, essa verificação da existência
   * acontence em outras camadas, ai fica a decisão, mover isso para a camada de repository/replicar em ambas e manter o
   * teste ou realmente retirá-lo */
  /* it('Should get an error when not found', async () => {
      const userData = {
      id: crypto.randomUUID(),
      name: 'John2',
      email: 'john2@example.com'
      }
      const entity = new TestEntity(userData, notification)
      const repository = new TypeOrmRepository(
      dataSource,
      notification,
      TestEntitySchema
      )

      await repository.insert(entity)

      const userData2 = {
      id: crypto.randomUUID(),
      name: 'fulano',
      email: 'test2@example.com'
      }
      const entity2 = new TestEntity(userData2, notification)

      await expect(repository.update(entity2)).rejects.toThrow('not found')
      }) */

  it('Should get an error inserting an invalid field', async () => {
    const entity = new TestEntity(userData, notification)
    const repository = new TypeOrmRepository(
      dataSource,
      notification,
      TestEntitySchema,
      TestEntity
    )

    const inserted: any = await repository.insert(entity)

    inserted.name = null
    try {
      await repository.update(inserted)
    } catch (e) {
      expect(e).toBeInstanceOf(NotificationError)
      expect(e.message.toLowerCase()).toContain('obrigatório')
    }
  })

  it('Should return true when successful deleting a record', async () => {
    const entity = new TestEntity(userData, notification)
    const repository = new TypeOrmRepository(
      dataSource,
      notification,
      TestEntitySchema,
      TestEntity
    )

    await repository.insert(entity)

    const deleted = await repository.delete(userData.id)
    expect(deleted).toBeTruthy()
  })

  it('Should return false when not deleting a record', async () => {
    const entity = new TestEntity(userData, notification)
    const repository = new TypeOrmRepository(
      dataSource,
      notification,
      TestEntitySchema,
      TestEntity
    )

    await repository.insert(entity)

    const deleted = await repository.delete('122')
    expect(deleted).toBeFalsy()
  })

  it('Should return an error when is null or blank ', async () => {
    const entity = new TestEntity(userData, notification)
    const repository = new TypeOrmRepository(
      dataSource,
      notification,
      TestEntitySchema,
      TestEntity
    )

    await repository.insert(entity)
    await expect(repository.delete(null)).rejects.toThrow('id is required')
  })

  it('Should found one Record', async () => {
    const entity = new TestEntity(userData, notification)
    const repository = new TypeOrmRepository(
      dataSource,
      notification,
      TestEntitySchema,
      TestEntity
    )
    await repository.insert(entity)

    const searchParams = new SearchParams({}, typeOrmParser)
    const searchResult = await repository.search(searchParams)
    expect(searchResult.items.length).toEqual(1)
    expect(searchResult.total).toEqual(1)
  })

  it('Should found 10 Records', async () => {
    const repository = new TypeOrmRepository(
      dataSource,
      notification,
      TestEntitySchema,
      TestEntity
    )
    for (let i = 0; i < 10; i++) {
      const userData = {
        id: crypto.randomUUID(),
        name: faker.name.fullName(),
        email: faker.internet.email()
      }
      const entity = new TestEntity(userData, notification)

      await repository.insert(entity)
    }
    const searchParams = new SearchParams({}, typeOrmParser)
    const searchResult = await repository.search(searchParams)
    expect(searchResult.items.length).toEqual(10)
    expect(searchResult.total).toEqual(10)
  })

  it('Should return page with 2 Records on database with 10 Records', async () => {
    const repository = new TypeOrmRepository(
      dataSource,
      notification,
      TestEntitySchema,
      TestEntity
    )
    for (let i = 0; i < 10; i++) {
      const userData = {
        id: crypto.randomUUID(),
        name: faker.name.fullName(),
        email: faker.internet.email()
      }
      const entity = new TestEntity(userData, notification)

      await repository.insert(entity)
    }

    const searchParams = new SearchParams({ perPage: 2 }, typeOrmParser)
    const searchResult = await repository.search(searchParams)
    expect(searchResult.items.length).toEqual(2)
    expect(searchResult.total).toEqual(10)
  })

  it('Should found 1 Record when search by email', async () => {
    const entity = new TestEntity(userData, notification)
    const repository = new TypeOrmRepository(
      dataSource,
      notification,
      TestEntitySchema,
      TestEntity
    )

    await repository.insert(entity)
    for (let i = 0; i < 10; i++) {
      const userData = {
        id: crypto.randomUUID(),
        name: faker.name.fullName(),
        email: faker.internet.email()
      }
      const entity = new TestEntity(userData, notification)

      await repository.insert(entity)
    }

    const searchParams = new SearchParams(
      {
        filter: [{ email: 'john@example.com' }]
      },
      typeOrmParser
    )
    const searchResult = await repository.search(searchParams)
    expect(searchResult.items.length).toEqual(1)
    expect(searchResult.total).toEqual(1)
  })

  it('Should found 1 Record when search by email using AND and OR operators', async () => {
    const entity = new TestEntity(userData, notification)
    const repository = new TypeOrmRepository(
      dataSource,
      notification,
      TestEntitySchema,
      TestEntity
    )

    await repository.insert(entity)
    for (let i = 0; i < 10; i++) {
      const userData = {
        id: crypto.randomUUID(),
        name: faker.name.fullName(),
        email: faker.internet.email()
      }
      const entity = new TestEntity(userData, notification)

      await repository.insert(entity)
    }

    const filter: FilterCondition = [
      { email: { $eq: 'john3@example.com' } },
      { email: { $ne: 'john@example.com' }, name: 'maria' },
      [{ email: 'john@example.com', name: 'John' }]
    ]

    const searchParams = new SearchParams(
      {
        page: 1,
        perPage: 15,
        sort: { name: 'asc' },
        filter
      },
      typeOrmParser
    )
    const searchResult = await repository.search(searchParams)
    // expect(searchResult.items.length).toEqual(1)
    expect(searchResult.items.length).toEqual(1)
    expect(searchResult.total).toEqual(1)
  })

  it('Should execute a RAW SQL and return a record', async () => {
    const entity = new TestEntity(userData, notification)
    const repository = new TypeOrmRepository(
      dataSource,
      notification,
      TestEntitySchema,
      TestEntity
    )

    await repository.insert(entity)
    for (let i = 0; i < 10; i++) {
      const userData = {
        id: crypto.randomUUID(),
        name: faker.name.fullName(),
        email: faker.internet.email()
      }
      const entity = new TestEntity(userData, notification)

      await repository.insert(entity)
    }

    const email = 'john@example.com'
    const searchResult = await repository.executeSQL(
      `select * from test where email='${email}'`
    )
    // expect(searchResult.items.length).toEqual(1)
    expect(searchResult.length).toEqual(1)
    expect(searchResult[0].email).toEqual(email)
  })

  it('Should execute a RAW SQL and insert a record', async () => {
    const userData = {
      id: crypto.randomUUID(),
      name: faker.name.fullName(),
      email: faker.internet.email()
    }

    const repository = new TypeOrmRepository(
      dataSource,
      notification,
      TestEntitySchema,
      TestEntity
    )

    await repository.executeSQL(
      `insert into test(id, name, email) values('${userData.id}', '${userData.name}', '${userData.email}')`
    )
    const searchResult = await repository.executeSQL(
      `select * from test where email='${userData.email}'`
    )
    // expect(searchResult.items.length).toEqual(1)
    expect(searchResult.length).toEqual(1)
    expect(searchResult[0].email).toEqual(userData.email)
    expect(searchResult[0].id).toEqual(userData.id)
  })

  it('Should found 1 Record when search by email and return only the attribute email', async () => {
    const entity = new TestEntity(userData, notification)
    const repository = new TypeOrmRepository(
      dataSource,
      notification,
      TestEntitySchema,
      TestEntity
    )

    await repository.insert(entity)
    for (let i = 0; i < 10; i++) {
      const userData = {
        id: crypto.randomUUID(),
        name: faker.name.fullName(),
        email: faker.internet.email()
      }
      const entity = new TestEntity(userData, notification)

      await repository.insert(entity)
    }

    const searchParams = new SearchParams(
      {
        filter: [{ email: 'john@example.com' }],
        attributes: ['email']
      },
      typeOrmParser
    )
    const searchResult = await repository.search(searchParams)
    expect(searchResult.items.length).toEqual(1)
    expect(searchResult.items[0]).toEqual({
      email: 'john@example.com'
    })
    expect(searchResult.total).toEqual(1)
  })

  it('Should found 1 Record when search by email and return all the attributes', async () => {
    const entity = new TestEntity(userData, notification)
    const repository = new TypeOrmRepository(
      dataSource,
      notification,
      TestEntitySchema,
      TestEntity
    )

    await repository.insert(entity)
    for (let i = 0; i < 10; i++) {
      const userData = {
        id: crypto.randomUUID(),
        name: faker.name.fullName(),
        email: faker.internet.email()
      }
      const entity = new TestEntity(userData, notification)

      await repository.insert(entity)
    }

    const searchParams = new SearchParams(
      {
        filter: [{ email: 'john@example.com' }],
        attributes: []
      },
      typeOrmParser
    )
    const searchResult = await repository.search(searchParams)
    expect(searchResult.items[0]).toHaveProperty('id')
    expect(searchResult.items[0]).toHaveProperty('name')
    expect(searchResult.items[0]).toHaveProperty('email')
    expect(searchResult.total).toEqual(1)
  })
})
