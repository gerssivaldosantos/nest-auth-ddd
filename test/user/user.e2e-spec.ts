import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { UserModule } from '../../src/user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeOrmConfigService } from '../../src/database/typeorm-config.service'
import { ConfigModule } from '@nestjs/config'
import databaseConfig from '../../src/config/database.config'
import { applyGlobalConfig } from '../../src/global-config'
import { UserFakerDatabuilder } from '@core/user/domain/entities/user.faker.databuilder'
import { FilterCondition, FilterOperator } from '@core/@shared/infra/types'
import { FieldDataFaker } from '@core/@shared/domain/tests/faker.databuilder'

describe('User E2E', () => {
  let app: INestApplication

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [databaseConfig],
          envFilePath: ['.env.test'] // IMPORTANT
        }),
        TypeOrmModule.forRootAsync({
          useClass: TypeOrmConfigService
        }),
        UserModule
      ]
    }).compile()
    app = module.createNestApplication()
    applyGlobalConfig(app)
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('POST (create) /user', () => {
    it('Should create when submitting valid data', async () => {
      const builder = new UserFakerDatabuilder()
      const inputValid = builder.buildValid()
      const requestResult = await request(app.getHttpServer())
        .post('/user')
        .send(inputValid)
        .expect(201)
      expect(requestResult.body.id).toBeDefined()
      expect(requestResult.body).toMatchObject(inputValid)
    })

    it('Should get an error when submitting invalid data to be created', async () => {
      const builder = new UserFakerDatabuilder()
      const fieldName = builder.getRandomField().name
      const inpuInvalid = builder.buildInValid([fieldName])
      const requestResult = await request(app.getHttpServer())
        .post('/user')
        .send(inpuInvalid)
        .expect(422)
      expect(requestResult.body.errors).toBeDefined()
      expect(requestResult.body.errors[fieldName]).toBeDefined()
    })
  })

  describe('GET (search) /user', () => {
    it('Should get SearchResult when submitting valid filter', async () => {
      const builder = new UserFakerDatabuilder()
      for (const field of builder.fields.filter(
        (field) =>
          ![
            'updatedAt',
            'createdAt',
            'password',
            'refreshToken',
            'refreshTokenExpiration'
          ].includes(field.name)
      )) {
        const inputValid = builder.buildValid()
        const { body: created } = await request(app.getHttpServer())
          .post('/user')
          .send(inputValid)
          .expect(201)

        for (let i = 0; i <= 5; i++) {
          await request(app.getHttpServer())
            .post('/user')
            .send(builder.buildValid())
            .expect(201)
        }

        const filter: FilterCondition = builder.fields.reduce(
          (acumulator, field: FieldDataFaker) => {
            return Object.assign(acumulator, {
              [field.name]: { [FilterOperator.Equal]: created[field.name] }
            })
          },
          {}
        )
        const requestResult = await request(app.getHttpServer())
          .post('/user/search')
          .send({
            filter: [filter]
          })
          .expect(200)

        expect(requestResult.body.total).toEqual(1)
        expect(requestResult.body.items.length).toEqual(1)
        expect(requestResult.body.items[0][field.name]).toEqual(
          created[field.name]
        )
      }
    })

    it('Should get an error when submitting invalid filter to be searched', async () => {
      await request(app.getHttpServer())
        .get('/user')
        .send({
          page: 1,
          filter: [{ teste: 1 }]
        })
        .expect(404)
    })
  })

  describe('PUT (update) /user', () => {
    it('Should update when submitting valid data', async () => {
      const builder = new UserFakerDatabuilder()
      const inputValid = builder.buildValid()
      const createResult = await request(app.getHttpServer())
        .post('/user')
        .send(inputValid)
        .expect(201)
      expect(createResult.body.id).toBeDefined()
      expect(createResult.body).toMatchObject(inputValid)

      const inputValid2 = builder.buildValid()
      await request(app.getHttpServer())
        .post('/user')
        .send(inputValid2)
        .expect(201)

      const requestResult = await request(app.getHttpServer())
        .put(`/user/${createResult.body.id}`)
        .send(inputValid2)
        .expect(200)
      expect(requestResult.body.id).toBeDefined()
      expect(requestResult.body.id).toEqual(createResult.body.id)
      expect({ ...requestResult.body, id: undefined }).toMatchObject({
        ...inputValid2,
        id: undefined
      })
    })

    it('Should get an error when submitting invalid data to be updated', async () => {
      const builder = new UserFakerDatabuilder()
      for (const field of builder.fields.filter((f) => f.name !== 'id')) {
        const inputValid = builder.buildValid()
        const createResult = await request(app.getHttpServer())
          .post('/user')
          .send(inputValid)
          .expect(201)
        expect(createResult.body.id).toBeDefined()
        expect(createResult.body).toMatchObject(inputValid)

        const inputValid2 = builder.buildInValid([field.name])

        const requestResult = await request(app.getHttpServer())
          .put(`/user/${createResult.body.id}`)
          .send(inputValid2)
          .expect(422)
        expect(requestResult.body.errors[field.name]).toBeDefined()
      }
    })
  })

  describe('DELETE (remove) /user', () => {
    it('should get TRUE when submitting valid id ', async () => {
      const builder = new UserFakerDatabuilder()
      const inputValid = builder.buildValid()
      const createResult = await request(app.getHttpServer())
        .post('/user')
        .send(inputValid)
        .expect(201)
      expect(createResult.body.id).toBeDefined()
      expect(createResult.body).toMatchObject(inputValid)

      // delete
      await request(app.getHttpServer())
        .delete(`/user/${createResult.body.id}`)
        .expect(204)
    })

    it('should get 404 when submitting invalid id ', async () => {
      const builder = new UserFakerDatabuilder()
      const inputValid = builder.buildValid()
      const createResult = await request(app.getHttpServer())
        .post('/user')
        .send(inputValid)
        .expect(201)
      expect(createResult.body.id).toBeDefined()
      expect(createResult.body).toMatchObject(inputValid)

      // delete
      await request(app.getHttpServer()).delete('/user/333').expect(404)
    })
  })
})
