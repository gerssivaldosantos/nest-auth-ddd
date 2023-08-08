import { DataSource, DataSourceOptions } from 'typeorm'
import { config as readEnv } from 'dotenv'
import * as path from 'path'
import { TestEntitySchema } from '@core/@shared/infra/db/typeorm/typeorm-repository.test-schema'

export class TypeOrmFactory {
  public static dataSource: DataSource

  public static async getDataSourceInstance(env: string): Promise<DataSource> {
    if (!this.dataSource || !this.dataSource.isInitialized) {
      this.dataSource = new DataSource(
        TypeOrmFactory.getConnectionParameters(env)
      )
      await this.dataSource.initialize()
    }
    return this.dataSource
  }

  public static getConnectionParameters(env = '.env'): DataSourceOptions {
    const output = readEnv({
      path: path.resolve(process.cwd(), env)
    })
    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      type: output.parsed.DATABASE_TYPE,
      host: String(output.parsed.DATABASE_HOST),
      port: Number(output.parsed.DATABASE_PORT),
      username: output.parsed.DATABASE_USERNAME,
      password: output.parsed.DATABASE_PASSWORD,
      database: String(output.parsed.DATABASE_NAME),
      entities: ['src/@core/**/*.schema.ts', TestEntitySchema],
      synchronize: Boolean(output.parsed.DATABASE_SYNCHRONIZE) === true,
      logging: Boolean(output.parsed.DATABASE_LOGGING) === false
    }
    /*
    return {
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: ['src/!**!/!*.schema.ts'],
      synchronize: true,
      logging: false
    } */
  }
}
