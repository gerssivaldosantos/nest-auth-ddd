import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AuthModule } from '../../src/auth/auth.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeOrmConfigService } from '../../src/database/typeorm-config.service'
import { ConfigModule } from '@nestjs/config'
import databaseConfig from '../../src/config/database.config'
import { applyGlobalConfig } from '../../src/global-config'
import { UserFakerDatabuilder } from '@core/user/domain/entities/user.faker.databuilder'

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

  describe('POST (SignUp) /auth/signup', () => {
    it('Should signup when submitting valid data', async () => {
      const builder = new UserFakerDatabuilder()
      const inputValid = builder.buildValid()
      const requestResult = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(inputValid)
        .expect(201)
      expect(requestResult.body.id).toBeDefined()
      expect(requestResult.body).toMatchObject(inputValid)
    })

    /* it('Should get an error when submitting invalid data to be created', async () => {
      const builder = new AuthFakerDatabuilder()
      const fieldName = builder.getRandomField().name
      const inpuInvalid = builder.buildInValid([fieldName])
      const requestResult = await request(app.getHttpServer())
        .post('/auth')
        .send(inpuInvalid)
        .expect(422)
      expect(requestResult.body.errors).toBeDefined()
      expect(requestResult.body.errors[fieldName]).toBeDefined()
    }) */
  })
})
