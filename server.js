const express = require('express')
const app = express()
const rowdy = require('rowdy-logger')
const cookieParser = require('cookie-parser')
const models = require('./models')
const cryptojs = require('crypto-js')
// middleware
const rowdyRes = rowdy.begin(app)
app.use(require('morgan')('tiny'))
app.set('view engine', 'ejs')
app.use(require('express-ejs-layouts'))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())


app.use(async (req, res, next) => {
  const decryptedUserId = cryptojs.AES.decrypt(req.cookies.userId, 'super secret string')
  const decryptedIdString = decryptedUserId.toString(cryptojs.enc.Utf8)
  const user = await models.user.findByPk(decryptedIdString)
  
  res.locals.user = user
  
  next()
  
})

// routes
app.get('/', async (req, res) => {
  console.log(res.user)
  res.render('index')
})

app.use('/user', require('./controller/userController'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('server started!');
  rowdyRes.print()
})