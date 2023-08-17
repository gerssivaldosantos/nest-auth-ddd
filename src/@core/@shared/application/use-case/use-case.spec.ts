import { UseCase } from '@core/@shared/application/use-case/use-case'
import Notification from '@core/@shared/domain/notification/notification'
import { Entity } from '@core/@shared/domain/entity/entity'
import { MinLength } from 'class-validator'
import { UseCaseOutputInterface } from '@core/@shared/application/use-case/use-case.interface'
import { describe, expect, it } from 'vitest'
describe('Base UseCase', () => {
  it('should create an instance of UseCase', () => {
    class TestUseCase extends UseCase {}
    const testBaseUseCase = new TestUseCase()
    expect(testBaseUseCase).toBeInstanceOf(TestUseCase)
  })

  it('should return an error if class does not implement an execute method', () => {
    class TestUseCase extends UseCase {}
    const testBaseUseCase = new TestUseCase()
    expect(testBaseUseCase.execute()).rejects.toThrow('Not implemented')
  })

  it('should return a object with validations', async () => {
    class TestEntity1 extends Entity {
      @MinLength(10)
        id: string

      @MinLength(10)
        name: string

      constructor (id: string, name: string) {
        const notification = new Notification()
        super(notification)
        this.id = id
        this.name = name
      }

      getPlainClass (): any {
        return TestEntity1
      }
    }
    class TestEntity2 extends Entity {
      @MinLength(10)
        id: string

      @MinLength(10)
        name: string

      getPlainClass (): any {
        return TestEntity2
      }

      constructor (id: string, name: string) {
        const notification = new Notification()
        super(notification)
        this.id = id
        this.name = name
      }
    }
    const resultExpectedOutput = {
      id: {
        value: '1',
        messages: 'id must be longer than or equal to 10 characters',
        invalid: true
      },
      name: {
        value: 'username',
        messages: 'name must be longer than or equal to 10 characters',
        invalid: true
      },
      group: {
        id: {
          value: '2',
          messages: 'id must be longer than or equal to 10 characters',
          invalid: true
        },
        name: {
          value: 'groupname',
          messages: 'name must be longer than or equal to 10 characters',
          invalid: true
        }
      }
    }
    const inputUseCase = {
      id: { value: '1', entity: 'UserEntity' },
      name: { value: 'username', entity: 'user' },
      group: {
        id: { value: '2', entity: 'group' },
        name: { value: 'groupname', entity: 'group' }
      }
    }
    class TestUseCase extends UseCase {
      async execute (arg?: any): Promise<UseCaseOutputInterface | any> {
        const testEntity1 = new TestEntity1(arg.id.value, arg.name.value)
        const testEntity2 = new TestEntity2(
          arg.group.id.value,
          arg.group.name.value
        )
        return {
          ...(await testEntity1.validate()),
          group: {
            ...(await testEntity2.validate())
          }
        }
      }
    }

    const testBaseUseCase = new TestUseCase()
    const output = await testBaseUseCase.execute(inputUseCase)
    expect(output).toMatchObject(resultExpectedOutput)
  })

  it('should return invalid = false if input data has invalid = true', () => {
    const inputData = {
      id: { value: 1, invalid: true }
    }
    expect(UseCase.clearValidationErrors(inputData)).toEqual({
      id: { value: 1, invalid: false }
    })
  })

  it('should return context = "" if input data has context <> ""', () => {
    const inputData = {
      id: { value: 1, context: 'teste' }
    }
    expect(UseCase.clearValidationErrors(inputData)).toEqual({
      id: { value: 1, context: '' }
    })
  })

  it('should return messages = "" if input data has messages <> ""', () => {
    const inputData = {
      id: { value: 1, messages: 'teste' }
    }
    expect(UseCase.clearValidationErrors(inputData)).toEqual({
      id: { value: 1, messages: '' }
    })
  })
})
