import NotificationInterface from '@core/@shared/domain/notification/notification.interface'
import { SearchParams } from '@core/@shared/domain/repository/search-params.repository'
import { DataSource, FindOptionsOrder } from 'typeorm'
import NotificationError from '@core/@shared/domain/notification/notification.error'
import { Entity } from '@core/@shared/domain/entity/entity'
import { FilterCondition } from '@core/@shared/infra/types'
import { RepositoryInterface } from '@core/@shared/domain/repository/repository.interface'
import {
  SearchResult,
  SearchResultProps
} from '@core/@shared/domain/repository/search-result.repository'

export class TypeOrmRepository<E extends Entity>
  implements RepositoryInterface<Entity>
{
  repo
  notification: NotificationInterface
  EntityClass: new (...args: any[]) => any

  /*
    @params dataSource The typeorm data source of the repository
    @params Entity The domain entity class
    @params notification The notification instance
    @params entitySchema The typeorm schema of the entity
     */

  constructor(
    private dataSource: DataSource,
    notification: NotificationInterface,
    entitySchema: any,
    EntityClass: new (...args: any[]) => any
  ) {
    this.EntityClass = EntityClass
    this.repo = this.dataSource.getRepository(entitySchema)
    this.notification = notification
  }

  async delete(id: string): Promise<boolean> {
    if (!id || id === '') {
      throw new NotificationError('id is required')
    }
    const deleted = await this.repo.delete({ id })
    return deleted.affected > 0
  }

  async findById(id: string | number): Promise<any> {
    const found = await this.repo.find({ where: { id } })
    if (!found[0]) {
      this.notification.addError({
        message: 'Could not find by id',
        value: id,
        target: this.repo,
        context: 'TypeOrmRepository'
      })
      return null
    }
    return new this.EntityClass(found[0], this.notification)
  }

  async insert(entity: E): Promise<E> {
    // ATTENTION: Always validate the entity before inserting it
    await entity.validate()
    if (!entity.notification.hasError()) {
      return this.repo.save(entity)
    } else {
      throw new NotificationError(entity.notification.getPlainMessageErrors())
    }
  }

  async search(props: SearchParams<FilterCondition>): Promise<SearchResult<E>> {
    try {
      const found = await this.repo.findAndCount({
        where: props.filter,
        skip:
          props.page && props.perPage
            ? (props.page - 1) * props.perPage
            : undefined,
        take: props.perPage,
        order: props.sort as unknown as FindOptionsOrder<any>,
        select: [...(props.attributes || [])]?.reduce(
          (obj, key) => Object.assign(obj, { [key]: true }),
          props.include
            ?.map((item) => {
              if (!item.attributes?.length) return { [item.entity]: true }
              else {
                const aux = { [item.entity]: {} }
                item.attributes.forEach((attr) => {
                  aux[item.entity][attr] = true
                })
                return aux
              }
            })
            ?.reduce((concat, acc) => {
              return Object.assign(concat, { ...acc })
            }, {}) || {}
        ),
        relations: props.include?.reduce(
          (obj, acc) => Object.assign(obj, { [acc.entity]: true }),
          {}
        )
      })
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const searchResultProps: SearchResultProps<E> = {
        items: found[0],
        total: found[1],
        perPage: props.perPage,
        sort: props.sort,
        currentPage: props.page
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore

      return new SearchResult(searchResultProps)
    } catch (e) {
      return Promise.reject(new NotificationError(e.message))
    }
  }

  async executeSQL(sql: string): Promise<any> {
    return this.dataSource.manager.query(sql)
  }

  async update(entity: E): Promise<E> {
    // ATTENTION: Always validate the entity before updating it
    await entity.validate()
    if (!entity.notification.hasError()) {
      return await this.repo.save(entity)
    } else {
      throw new NotificationError(entity.notification.getPlainMessageErrors())
    }
  }
}
