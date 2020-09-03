const router = require('express').Router()
const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const cfg = require('../../../config')

router.use('/lb', require('./lb'))
router.use('/sign', require('./sign'))
router.use('/site', require('./site'))

const verifyToken = (t) => {
  return new Promise((resolve, reject) => {
    if (!t) resolve({ email: 'guest@rego.com', name: '손님', lv: 3 })
    if ((typeof t) !== 'string') reject(new Error('문자가 아닌 토큰 입니다.'))
    if (t.length < 10) resolve({ email: 'guest@rego.com', name: '손님', lv: 3 })
    jwt.verify(t, cfg.jwt.secretKey, (err, v) => {
      if (err) reject(err)
      resolve(v)
    })
  })
}

const signToken = (_id, email, lv, name, exp) => {
  return new Promise((resolve, reject) => {
    const o = {
      issuer: cfg.jwt.issuer,
      subject: cfg.jwt.subject,
      expiresIn: cfg.jwt.expiresIn,
      algorithm: cfg.jwt.algorithm,
      expiresIn: exp
    }
    jwt.sign({ _id, email, lv, name }, cfg.jwt.secretKey, o, (err, token) => {
      if (err) reject(err)
      resolve(token)
    })
  })
}

const getToken = async(t) => {
  let vt = await verifyToken(t)
  if (vt.lv > 2) return { user: vt, token: null }
  const diff = moment(vt.exp * 1000).diff(moment(), 'seconds')
  const expSec = (vt.exp - vt.iat)
  if (diff > expSec / cfg.jwt.expiresInDiv) return { user: vt, token: null }

  const nt = await signToken(vt._id, vt.email, vt.lv, vt.name, expSec)
  vt = await verifyToken(nt)
  return { user: vt, token: nt }
}

router.all('*', function(req, res, next) {
  getToken(req.headers.authorization)
    .then((v) => {
      req.user = v.user
      req.token = v.token
      next()
    })
    .catch(e => next(createError(401, e.message)))
})

router.use('/page', require('./page'))
router.use('/manage', require('./manage'))
router.use('/user', require('./user'))

router.all('*', require('./notFound'))

module.exports = router
