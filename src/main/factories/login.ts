import config from 'config'
import { Controller } from '@controllers/protocols'
import { LoginController } from '@controllers/controllers/login/login'
import { loginValidator } from '@controllers/controllers/login/login-validator'
import { ControllerLogger } from '@controllers/decorators/controller-logger'
import { DbAuthentication } from '@usecases/usecases/authentication/db-authentication'
import { BCryptAdapter } from '@gateways/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '@gateways/cryptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '@gateways/db/mongodb/acount/account-mongo-repository'
import { ConsoleLoggerAdapter } from '@utils/console-logger-adapter'
import { EmailValidatorAdapter } from '@utils/email-validator-adapter'

export const makeLoginController = (): Controller => {
  const loadByEmailRepository = new AccountMongoRepository()
  const hashComparer = new BCryptAdapter()
  const jwtSecretPhrase = config.get<string>('app.jwt.secret')
  const tokenGenerator = new JwtAdapter(jwtSecretPhrase)
  const authentication = new DbAuthentication(loadByEmailRepository, hashComparer, tokenGenerator)
  const emailValidator = new EmailValidatorAdapter()
  const validator = loginValidator(emailValidator)
  const loginController = new LoginController(authentication, validator)
  const consoleLoggerAdapter = new ConsoleLoggerAdapter()
  return new ControllerLogger(loginController, consoleLoggerAdapter)
}
