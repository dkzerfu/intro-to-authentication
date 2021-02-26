const router = require('express').Router()
const models = require('../models')
const cryptoJs = require('crypto-js')

router.get('/new', async (req, res) => {
    res.render('user/new')
})

router.post('/', async (req, res) => {
    const user = await models.user.create({
        email: req.body.email,
        password: req.body.password
    })
    const encryptedUserId = cryptoJs.AES.encrypt(user.id.toString(), 'super secret string ')
    res.cookie('userId', encryptedUserId)
    res.redirect('/')
})

router.get('/login', (req, res) => {
    res.render('user/login')
})

router.post('/login', async (req,res) => {
    const user = await models.user.findOne({
        where:{email: req.body.email}
    })
    if(user.password === req.body.password){
        const encryptedUserId = cryptoJs.AES.encrypt(user.id.toString(), 'super secret string')
        res.cookie('userId', encryptedUserId)
        res.redirect('/')
    }else{
        res.render('user/login')
    }
    console.log(user)
})

router.get('/logout', async (req, res) =>{
    res.clearCookie('userId')
    res.redirect('/')
})
module.exports = router