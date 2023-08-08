import { CreateAuthUseCase } from '@core/auth/application/use-case/create-auth.use-case'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseFilters
} from '@nestjs/common'
import { AuthCreateDto } from '@core/auth/application/dto/auth-create.dto'
import {
  ApiBody,
  ApiConsumes,
  ApiProperty,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { SearchAuthUseCase } from '@core/auth/application/use-case/search-auth.use-case'
import { DeleteAuthUseCase } from '@core/auth/application/use-case/delete-auth.use-case'
import { FindByIdAuthUseCase } from '@core/auth/application/use-case/findById-auth.use-case'
import { UpdateAuthUseCase } from '@core/auth/application/use-case/update-auth.use-case'
import { AuthUpdateDto } from '@core/auth/application/dto/auth-update.dto'
import { AuthSearchDto } from '@core/auth/application/dto/auth-search.dto'
import { AuthGetOneResultDto } from '@core/auth/application/dto/auth-get-one-result.dto'
import { SearchResultDto } from '@core/@shared/application/dto/search-result.dto'
import { AuthCreateResultDto } from '@core/auth/application/dto/auth-create-result.dto'
import { NotificationErrorExceptionFilter } from '../exceptionFilter'

@ApiTags('Auth')
@UseFilters(NotificationErrorExceptionFilter)
@Controller('auth')
export class AuthController {
  constructor(
    private insertAuthUseCase: CreateAuthUseCase,
    private findByIdAuthUsecase: FindByIdAuthUseCase,
    private searchAuthUseCase: SearchAuthUseCase,
    private updateAuthUseCase: UpdateAuthUseCase,
    private deleteAuthUseCase: DeleteAuthUseCase
  ) {}

  @ApiBody({
    description: 'Auth - Create a record',
    type: () => AuthCreateDto
  })
  @ApiConsumes('application/json')
  @ApiResponse({ type: () => AuthCreateResultDto })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createAuthDto: AuthCreateDto) {
    return this.insertAuthUseCase.execute(createAuthDto)
  }

  @ApiBody({
    description: 'Auth - Update a record',
    type: () => AuthUpdateDto
  })
  @ApiConsumes('application/json')
  @ApiResponse({ type: () => AuthUpdateDto })
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: AuthUpdateDto) {
    const changeToData = { ...updateDto, id }
    return await this.updateAuthUseCase.execute(changeToData)
  }

  @ApiProperty({
    description: 'Auth - Delete a record'
  })
  @ApiConsumes('application/json')
  @ApiResponse({ type: () => Boolean })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = await this.deleteAuthUseCase.execute(id)
    if (!result) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
    }
  }

  @ApiConsumes('application/json')
  @ApiResponse({ type: () => AuthGetOneResultDto })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.findByIdAuthUsecase.execute(id)
  }

  @ApiProperty({
    description: 'Auth - Search',
    type: () => AuthSearchDto
  })
  @ApiConsumes('application/json')
  @ApiResponse({ type: () => SearchResultDto })
  @HttpCode(HttpStatus.OK)
  @Post('search')
  async search(@Body() searchAuthDto: AuthSearchDto) {
    try {
      return await this.searchAuthUseCase.execute(searchAuthDto)
    } catch (e) {
      throw new HttpException(
        { name: e.name, message: e.message },
        HttpStatus.BAD_REQUEST
      )
    }
  }
}
