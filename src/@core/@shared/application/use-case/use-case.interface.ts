export interface UseCaseOutputInterface {
  [key: string]: { value: any; invalid: boolean; message: string }
}
export interface UseCaseInterface {
  execute(arg?: any): Promise<UseCaseOutputInterface | any>
}
