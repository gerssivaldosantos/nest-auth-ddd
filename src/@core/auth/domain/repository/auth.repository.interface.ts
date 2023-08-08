/* eslint-disable @typescript-eslint/no-empty-interface */
import AuthEntity from '@core/auth/domain/entities/auth.entity'
import { RepositoryInterface } from '@core/@shared/domain/repository/repository.interface'

export interface AuthRepositoryInterface
  extends RepositoryInterface<AuthEntity> {}
