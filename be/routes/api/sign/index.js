const router = require('express').Router()
const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const request = require('request')
const cfg = require('../../../../config')
const User = require('../../../models/users')

const signToken = (_id, email, lv, name, rmb) => {
  return new Promise((resolve, reject) => {
    const o = {
      issuer: cfg.jwt.issuer,
      subject: cfg.jwt.subject,
      expiresIn: cfg.jwt.expiresIn,
      algorithm: cfg.jwt.algorithm
    }
    if (rmb) o.expiresIn = cfg.jwt.expiresInRemember
    jwt.sign({ _id, email, lv, name }, cfg.jwt.secretKey, o, (err, token) => {
      if (err) reject(err)
      resolve(token)
    })
  })
}

router.post('/in', (req, res, next) => {
  const { email, pwd, remember } = req.body
  if (!email) throw createError(400, '이메일이 없습니다')
  if (!pwd) throw createError(400, '비밀번호가 없습니다')
  if (remember === undefined) throw createError(400, '기억하기가 없습니다.')

  let u = {}
  User.findOne({ email }).lean()
    .then((r) => {
      if (!r) throw new Error('존재하지 않는 이메일입니다.')
      const p = crypto.scryptSync(pwd, r._id.toString(), 64, { N: 1024 }).toString('hex')
      if (r.pwd !== p) throw new Error('비밀번호가 틀립니다.')
      delete r.pwd
      u = r
      return signToken(r._id, r.email, r.lv, r.name, remember)
    })
    .then((r) => {
      res.send({ success: true, token: r, user: u })
    })
    .catch((e) => {
      res.send({ success: false, msg: e.message })
    })
})

router.post('/up', (req, res, next) => {
  const u = req.body
  if (!u.email) throw createError(400, '이메일이 없습니다')
  if (!u.pwd) throw createError(400, '비밀번호가 없습니다')
  if (!u.name) throw createError(400, '이름이 없습니다')

  User.findOne({ email: u.email })
    .then((r) => {
      if (r) throw new Error('이미 등록되어 있는 아이디입니다')
      return User.create(u)
    })
    .then((r) => {
      const pwd = crypto.scryptSync(r.pwd, r._id.toString(), 64, { N: 1024 }).toString('hex')
      return User.updateOne({ _id: r._id }, { $set: { pwd } })
    })
    .then((r) => {
      res.send({ success: true })
    })
    .catch((e) => {
      res.send({ success: false, msg: e.message })
    })
})

module.exports = router;
