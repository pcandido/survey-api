import { Router } from 'express'
import { adaptAuthenticatedRoute, adaptRoute } from '@main/adapters/express-request-adapter'
import { makeSignUpController, makeLoginController, makeRefreshTokenController, makeSetImageController } from '@main/factories'

export default (): Router => {
  const router = Router()

  router.route('/signup').post(adaptRoute(makeSignUpController()))
  router.route('/login').post(adaptRoute(makeLoginController()))
  router.route('/refresh-token').post(adaptAuthenticatedRoute(makeRefreshTokenController()))
  router.route('/set-image').post(adaptAuthenticatedRoute(makeSetImageController()))

  return router
}
