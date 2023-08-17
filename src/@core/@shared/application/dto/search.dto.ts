import { FilterCondition, SortParam } from '@core/@shared/infra/types'
import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNumber, IsOptional } from 'class-validator'

export class Sort {
  @ApiProperty({ description: 'Field to be ordered', example: 'name' })
    fieldName: string

  @ApiProperty({ description: 'Order to be applying', example: 'asc' })
    order: string
}

export class SearchDto {
  @ApiProperty({
    description: 'Number of page to be returned',
    type: 'integer',
    required: false,
    default: 1
  })
  @IsNumber()
  @IsOptional()
    page?: number | null

  @ApiProperty({
    description: 'Number of records per page',
    type: 'integer',
    required: false,
    default: 10
  })
  @IsNumber()
  @IsOptional()
    perPage?: number | null

  @ApiProperty({
    description: 'Field to be  sorted and direction',
    type: {},
    required: false,
    example: { name: 'asc' }
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
