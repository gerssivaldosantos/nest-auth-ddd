import { CreateUserUseCase } from '@core/user/application/use-case/create-user.use-case'
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
import { UserCreateDto } from '@core/user/application/dto/user-create.dto'
import {
  ApiBody,
  ApiConsumes,
  ApiProperty,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { SearchUserUseCase } from '@core/user/application/use-case/search-user.use-case'
import { DeleteUserUseCase } from '@core/user/application/use-case/delete-user.use-case'
import { FindByIdUserUseCase } from '@core/user/application/use-case/findById-user.use-case'
import { UpdateUserUseCase } from '@core/user/application/use-case/update-user.use-case'
import { UserUpdateDto } from '@core/user/application/dto/user-update.dto'
import { UserSearchDto } from '@core/user/application/dto/user-search.dto'
import { UserGetOneResultDto } from '@core/user/application/dto/user-get-one-result.dto'
import { SearchResultDto } from '@core/@shared/application/dto/search-result.dto'
import { UserCreateResultDto } from '@core/user/application/dto/user-create-result.dto'
import { NotificationErrorExceptionFilter } from '../exceptionFilter'

@ApiTags('User')
@UseFilters(NotificationErrorExceptionFilter)
@Controller('user')
export class UserController {
  constructor(
    private insertUserUseCase: CreateUserUseCase,
    private findByIdUserUsecase: FindByIdUserUseCase,
    private searchUserUseCase: SearchUserUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase
  ) {}

  @ApiBody({
    description: 'User - Create a record',
    type: () => UserCreateDto
  })
  @ApiConsumes('application/json')
  @ApiResponse({ type: () => UserCreateResultDto })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createUserDto: UserCreateDto) {
    return this.insertUserUseCase.execute(createUserDto)
  }

  @ApiBody({
    description: 'User - Update a record',
    type: () => UserUpdateDto
  })
  @ApiConsumes('application/json')
  @ApiResponse({ type: () => UserUpdateDto })
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UserUpdateDto) {
    const changeToData = { ...updateDto, id }
    return await this.updateUserUseCase.execute(changeToData)
  }

  @ApiProperty({
    description: 'User - Delete a record'
  })
  @ApiConsumes('application/json')
  @ApiResponse({ type: () => Boolean })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = await this.deleteUserUseCase.execute(id)
    if (!result) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
    }
  }

  @ApiConsumes('application/json')
  @ApiResponse({ type: () => UserGetOneResultDto })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.findByIdUserUsecase.execute(id)
  }

  @ApiProperty({
    description: 'User - Search',
    type: () => UserSearchDto
  })
  @ApiConsumes('application/json')
  @ApiResponse({ type: () => SearchResultDto })
  @HttpCode(HttpStatus.OK)
  @Post('search')
  async search(@Body() searchUserDto: UserSearchDto) {
    try {
      return await this.searchUserUseCase.execute(searchUserDto)
    } catch (e) {
      throw new HttpException(
        { name: e.name, message: e.message },
        HttpStatus.BAD_REQUEST
      )
    }
  }
}
