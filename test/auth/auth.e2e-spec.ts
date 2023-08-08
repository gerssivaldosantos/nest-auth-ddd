import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AuthModule } from '../../src/auth/auth.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeOrmConfigService } from '../../src/database/typeorm-config.service'
import { ConfigModule } from '@nestjs/config'
import databaseConfig from '../../src/config/database.config'
import { applyGlobalConfig } from '../../src/global-config'
import { AuthFakerDatabuilder } from '@core/auth/domain/entities/auth.faker.databuilder'
import { FilterCondition, FilterOperator } from '@core/@shared/infra/types'
import { FieldDataFaker } from '@core/@shared/domain/tests/faker.databuilder'

describe('Auth E2E', () => {
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
        AuthModule
      ]
    }).compile()
    app = module.createNestApplication()
    applyGlobalConfig(app)
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('POST (create) /auth', () => {
    it('Should create when submitting valid data', async () => {
      const builder = new AuthFakerDatabuilder()
      const inputValid = builder.buildValid()
      const requestResult = await request(app.getHttpServer())
        .post('/auth')
        .send(inputValid)
        .expect(201)
      expect(requestResult.body.id).toBeDefined()
      expect(requestResult.body).toMatchObject(inputValid)
    })

    it('Should get an error when submitting invalid data to be created', async () => {
      const builder = new AuthFakerDatabuilder()
      const fieldName = builder.getRandomField().name
      const inpuInvalid = builder.buildInValid([fieldName])
      const requestResult = await request(app.getHttpServer())
        .post('/auth')
        .send(inpuInvalid)
        .expect(422)
      expect(requestResult.body.errors).toBeDefined()
      expect(requestResult.body.errors[fieldName]).toBeDefined()
    })
  })

  describe('GET (search) /auth', () => {
    it('Should get SearchResult when submitting valid filter', async () => {
      const builder = new AuthFakerDatabuilder()
      for (const field of builder.fields) {
        const inputValid = builder.buildValid()
        const { body: created } = await request(app.getHttpServer())
          .post('/auth')
          .send(inputValid)
          .expect(201)

        for (let i = 0; i <= 5; i++) {
          await request(app.getHttpServer())
            .post('/auth')
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
          .post('/auth/search')
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
        .get('/auth')
        .send({
          page: 1,
          filter: [{ teste: 1 }]
        })
        .expect(404)
    })
  })

  describe('PUT (update) /auth', () => {
    it('Should update when submitting valid data', async () => {
      const builder = new AuthFakerDatabuilder()
      const inputValid = builder.buildValid()
      const createResult = await request(app.getHttpServer())
        .post('/auth')
        .send(inputValid)
        .expect(201)
      expect(createResult.body.id).toBeDefined()
      expect(createResult.body).toMatchObject(inputValid)

      const inputValid2 = builder.buildValid()
      await request(app.getHttpServer())
        .post('/auth')
        .send(inputValid2)
        .expect(201)

      const requestResult = await request(app.getHttpServer())
        .put(`/auth/${createResult.body.id}`)
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
      const builder = new AuthFakerDatabuilder()
      for (const field of builder.fields.filter((f) => f.name !== 'id')) {
        const inputValid = builder.buildValid()
        const createResult = await request(app.getHttpServer())
          .post('/auth')
          .send(inputValid)
          .expect(201)
        expect(createResult.body.id).toBeDefined()
        expect(createResult.body).toMatchObject(inputValid)

        const inputValid2 = builder.buildInValid([field.name])

        const requestResult = await request(app.getHttpServer())
          .put(`/auth/${createResult.body.id}`)
          .send(inputValid2)
          .expect(422)
        expect(requestResult.body.errors[field.name]).toBeDefined()
      }
    })
  })

  describe('DELETE (remove) /auth', () => {
    it('should get TRUE when submitting valid id ', async () => {
      const builder = new AuthFakerDatabuilder()
      const inputValid = builder.buildValid()
      const createResult = await request(app.getHttpServer())
        .post('/auth')
        .send(inputValid)
        .expect(201)
      expect(createResult.body.id).toBeDefined()
      expect(createResult.body).toMatchObject(inputValid)

      // delete
      await request(app.getHttpServer())
        .delete(`/auth/${createResult.body.id}`)
        .expect(204)
    })

    it('should get 404 when submitting invalid id ', async () => {
      const builder = new AuthFakerDatabuilder()
      const inputValid = builder.buildValid()
      const createResult = await request(app.getHttpServer())
        .post('/auth')
        .send(inputValid)
        .expect(201)
      expect(createResult.body.id).toBeDefined()
      expect(createResult.body).toMatchObject(inputValid)

      // delete
      await request(app.getHttpServer()).delete('/auth/333').expect(404)
    })
  })
})
