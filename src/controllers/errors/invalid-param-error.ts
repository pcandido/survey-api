import { ValidationError } from './validation-error'

export class InvalidParamError extends ValidationError {

  constructor(paramName: string) {
    super(`Invalid param: ${paramName}`)
    this.name = this.constructor.name
  }

}
