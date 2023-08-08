import { IsArray, IsNumber, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { FilterCondition, SortParam } from '@core/@shared/infra/types'

export class UserSearchDto {
  @ApiProperty({
    description: 'Number of page to be returned',
    type: 'number',
    default: 1
  })
  @IsNumber()
  @IsOptional()
  page?: number | 1

  @ApiProperty({
    description: 'Number of records per page',
    type: 'number',
    default: 10
  })
  @IsNumber()
  @IsOptional()
  perPage?: number | 10

  @ApiProperty({
    description: 'Field to be  sorted and direction',
    type: {},
    example: { name: 'asc' },
    required: false
  })
  @IsOptional()
  sort?: SortParam

  @ApiProperty({
    description: 'Filter condition to apply',
    type: Array({}),
    required: false,
    example: [{ email: { $ne: 'john@example.com' } }]
  })
  @IsOptional()
  @IsArray()
  filter?: FilterCondition

  @ApiProperty({
    description: 'Attributes to be included in the response',
    type: Array(String),
    required: false,
    example: ['id', 'name', 'email']
  })
  @IsOptional()
  attributes?: string[]
}
