const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')

const User = require('../../models/User')

// @route /api/auth/login
// @desc login user and get token
// @access Public
router.post('/login', [
    check('email', 'Please include a email and make sure it is valid.').isEmail().exists(),
    check('password', 'Please include a password').exists()
], async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email })

        // console.log(`email is "${email}"`)
        // console.log(`1 - password is "${password}"`)
        // console.log(`2 - password is "${user.password}"`)

        if(!user) {
            return res.status(400).json({ msg: 'Email is wrong' })
        }
    
        const validPassword = await bcrypt.compare(password, user.password)
    
        if(!validPassword) {
            return res.status(400).json({ msg: 'Password is wrong' })
        }
    
        const payload = {
            userId: user._id,
            msg: "Successfully logged in!"
        }
    
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 360000 },
            (err, token) => {
                if(err) throw err
                res.json({ token })
            }
        )
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Server error')
    }
})


// create admin user - test route
router.get('/', async (req, res) => {
    try {

        const salt = await bcrypt.genSalt(10)
        const pw = await bcrypt.hash('12345678', salt)

        const user = await User.create({ 
            name: 'Ryan Haire', 
            username: 'RyanHaire', 
            email: 'rwhaire@hotmail.com',
            password: pw,
            phoneNumber: '9053349025',
            admin: true
        })
    
        res.json(user)
    } catch (error) {
        res.json(error)
    }
    
})

module.exports = router