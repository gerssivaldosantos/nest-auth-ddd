import { Entity } from '@core/@shared/domain/entity/entity'
import Notification from '@core/@shared/domain/notification/notification'
// eslint-disable-next-line no-unused-vars
import { MinLength } from 'class-validator'
import { NotificationErrorOutput } from '@core/@shared/domain/notification/notification.interface'

describe('Entity', () => {
  it('should return an entities context', () => {
    class Test extends Entity {
      constructor() {
        const notification = new Notification()
        super(notification)
      }
    }
    const test = new Test()
    expect(test.getName()).toEqual('Test')
  })

  it('should return an error notification', async () => {
    class Test extends Entity {
      @MinLength(10)
      id: string

      constructor(id: string) {
        const notification = new Notification()
        super(notification)
        this.id = id
      }

      getPlainClass(): any {
        return Test
      }
    }
    const test = new Test('1222')
    await test.validate()
    expect(test.notification.hasError()).toBeTruthy()
  })

  it('should return an error notification id must be longer than or equal to 10 characters', async () => {
    class Test extends Entity {
      @MinLength(10)
      id: string

      constructor(id: string) {
        const notification = new Notification()
        super(notification)
        this.id = id
      }

      getPlainClass(): any {
        return Test
      }
    }
    const test = new Test('1222')
    await test.validate()
    const notificationResult: Record<string, NotificationErrorOutput> = {
      id: {
        messages: ['id must be longer than or equal to 10 characters'],
        context: 'Test',
        invalid: true,
        value: '1222'
      }
    }
    expect(test.notification.getErrors()).toEqual(notificationResult)
  })

  it('should return an entities property in json', () => {
    class Test extends Entity {
      private _test: string
      private name: string
      constructor(id: string, name: string) {
        const notification = new Notification()
        super(notification, id)
        this.name = name
        this._test = 'test'
      }

      set test(value: string) {
        if (value) {
          this._test = value.replace(/[^0-9]/g, '')
        } else {
          this._test = undefined
        }
      }

      get test(): any {
        return this._test
      }

      getPlainClass() {
        return Test
      }
    }
    const test = new Test('1', 'test')
    const json = test.toJSON()
    expect(json).toMatchObject({
      id: '1',
      name: 'test'
    })
  })

  it('should return an entities property in output format', () => {
    class Test extends Entity {
      private name: string
      constructor(id: string, name: string) {
        const notification = new Notification()
        super(notification, id)
        this.name = name
      }
    }
    const test = new Test('1', 'test')
    const output = test.toOutput()
    expect(output).toMatchObject({
      id: { value: '1' },
      name: { value: 'test' }
    })
  })

  test('should return an error when the entity did not implement the "getPlainClass" method', async () => {
    class TestEntity extends Entity {
      constructor() {
        const notification = new Notification()
        super(notification)
      }
    }

    const testEntity = new TestEntity()
    expect(() => {
      testEntity.getPlainClass()
    }).toThrow('Method "getPlainClass" was not implemented')
  })

  it('should return a Test Class ', () => {
    class Test extends Entity {
      private _test: string
      constructor() {
        const notification = new Notification()
        super(notification)
        this._test = 'test'
      }

      set test(value: string) {
        if (value) {
          this._test = value.replace(/[^0-9]/g, '')
        } else {
          this._test = undefined
        }
      }

      get test(): any {
        return this._test
      }

      getPlainClass() {
        return Test
      }
    }
    const test = new Test()
    const ClassPlain = test.getPlainClass()
    const testClassPlain = new ClassPlain()
    expect(testClassPlain).toBeInstanceOf(Test)
  })
})
