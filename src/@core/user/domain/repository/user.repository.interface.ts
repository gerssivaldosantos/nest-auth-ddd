/* eslint-disable @typescript-eslint/no-empty-interface */
import UserEntity from '@core/user/domain/entities/user.entity'
import { RepositoryInterface } from '@core/@shared/domain/repository/repository.interface'

export interface UserRepositoryInterface
  extends RepositoryInterface<UserEntity> {}
