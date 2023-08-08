import { DataSource, DataSourceOptions } from 'typeorm'
import { config as readEnv, config } from 'dotenv'
import * as path from 'path'

config()

function getConnectionParameters(): DataSourceOptions {
  const output = readEnv({
    path: path.resolve(process.cwd(), '.env')
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
    entities: ['src/@core/**/*.schema.ts'],
    synchronize: false,
    migrations: ['src/database/migrations/**/*{.ts,.js}']
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

export default new DataSource(getConnectionParameters())
