import { DataSource } from 'typeorm'
import { TypeOrmFactory } from '@core/@shared/infra/db/typeorm/datasource'

describe('DataSource', () => {
  it('should create a DataSource instance', async () => {
    const dataSource = await TypeOrmFactory.getDataSourceInstance('.env.test')
    expect(dataSource).toBeInstanceOf(DataSource)

    const dataSource2 = await TypeOrmFactory.getDataSourceInstance('.env.test')
    expect(dataSource2).toBeInstanceOf(DataSource)
  })

  it('should get connection parameters', async () => {
    const parameters = await TypeOrmFactory.getConnectionParameters()
    expect(parameters).toHaveProperty('type')
  })
})
