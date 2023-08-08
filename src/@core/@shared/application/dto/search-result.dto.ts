import { SortParam } from '@core/@shared/infra/types'
import { ApiProperty } from '@nestjs/swagger'
import { IsArray } from 'class-validator'

export class SearchResultDto {
  @ApiProperty({ description: 'Search results items', type: [] })
  @IsArray()
  items: []

  @ApiProperty({ description: 'Total of items', type: 'number' })
  total: number

  @ApiProperty({ description: 'Current page', type: 'number' })
  currentPage: number

  @ApiProperty({ description: 'Items per page', type: 'number' })
  perPage: number

  @ApiProperty({ description: 'Last page', type: 'number' })
  lastPage: number

  @ApiProperty({ description: 'Sort param', type: Object })
  sort: SortParam
}
