const mongoose = require('mongoose')
const crypto = require('crypto')
const cfg = require('../../config')

mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)
const userSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  age: { type: Number, default: 1 },
  id: { type: String, default: '', unique: true, index: true },
  pwd: { type: String, default: '' },
  lv: { type: Number, default: 2 },
  inCnt: { type: Number, default: 0 },
  retry: { type: Number, default: 0 },
  img: { type: String, default: '' }
})

const User = mongoose.model('User', userSchema)

User.findOne({ id: cfg.admin.id })
  .then((r) => {
    if (!r) return User.create({ id: cfg.admin.id, pwd: cfg.admin.pwd, name: cfg.admin.name, lv: 0 })
    return Promise.resolve(r)
  })
  .then((r) => {
    if (r.pwd !== cfg.admin.pwd) return Promise.resolve(null)
    console.log(`admin:${r.id} created!`)
    const pwd = crypto.scryptSync(r.pwd, r._id.toString(), 64, { N: 1024 }).toString('hex')
    return User.updateOne({ _id: r._id }, { $set: { pwd } })
  })
  .then(r => {
    if (r) console.log('pwd changed!')
  })
  .catch((e) => {
    console.error(e.message)
  })

module.exports = User
