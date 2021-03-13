import { RefreshTokenController } from './refresh-token'
import { Validator } from '@presentation/protocols'
import { badRequest } from '@presentation/helpers/http-helper'

interface SutTypes {
  sut: RefreshTokenController
  validatorStub: Validator
}

const makeValidatorStub = () => {
  class ValidatorStub implements Validator {
    validate(): void {
      /* do nothing */
    }
  }

  return new ValidatorStub()
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const sut = new RefreshTokenController(validatorStub)
  return { sut, validatorStub }
}

describe('Refresh Token Controller', () => {

  it('should call validator with correct value', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSpy = jest.spyOn(validatorStub, 'validate')
    const givenToken = { refreshToken: 'refresh_token' }
    await sut.handle({ body: givenToken })
    expect(validateSpy).toBeCalledWith(givenToken)
  })

  it('should return badRequest if validator throws', async () => {
    const { sut, validatorStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => { throw givenError })
    const response = await sut.handle({ body: {} })
    expect(response).toEqual(badRequest(givenError))
  })

})
