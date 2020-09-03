const router = require('express').Router()
const createError = require('http-errors')
const crypto = require('crypto')
const User = require('../../../models/users')

router.post('/', (req, res) => {
  const u = req.body
  if (!u.email) throw createError(400, '이메일이 없습니다')
  if (!u.pwd) throw createError(400, '비밀번호가 없습니다')
  if (!u.name) throw createError(400, '이름이 없습니다.')

  User.findOne({ email: u.email })
    .then((r) => {
      if (r) throw new Error('이미 등록되어 있는 이메일입니다.')
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
