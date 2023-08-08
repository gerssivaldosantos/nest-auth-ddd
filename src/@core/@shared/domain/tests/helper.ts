import { TypeOrmFactory } from '@core/@shared/infra/db/typeorm/datasource'

export const clearAllEntites = async () => {
  const dataSource = await TypeOrmFactory.getDataSourceInstance('.env.test')
  const entities = dataSource.entityMetadatas
  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name)
    await repository.query(
      `TRUNCATE "${entity.tableName}" RESTART IDENTITY CASCADE;`
    )
  }
}
