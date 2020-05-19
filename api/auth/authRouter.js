const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Users = require('../users/usersModel.js')
const { isValidRegister, isValidLogin } = require('../users/usersService.js')

const router = require('express').Router()

router.post('/register', (req, res) => {
    const credentials = req.body

    // is valid register makes sure we have a department property when we sign in.
    if (isValidRegister(credentials)) {
        const rounds = process.env.BCRYPT_ROUNDS || 8

        // hash the password
        const hash = bcryptjs.hashSync(credentials.password, rounds)

        credentials.password = hash
        // save the user to the database
        Users.add(credentials)
            .then(user => {
                // client now gets a token after registering
                const token = createToken(user)
                res.status(201).json({ data: user, token })
            })
            .catch(error => {
                res.status(500).json({ message: error.message })
            })
    } else {
        res.status(400).json({
            message: 'Please provide username and password and the password shoud be alphanumeric.',
        })
  }
})

router.post('/login', (req, res) => {
    const { username, password } = req.body

    // isValidLogin makes sure that we have a username and password, but doesn't require a department property
    if (isValidLogin(req.body)) {
        Users.findBy({ username })
            .then(([user]) => {
                // compare the password the hash stored in the database
                if (user && bcryptjs.compareSync(password, user.password)) {
                    // produce and send a token that includes the username and the role of the user
                    const token = createToken(user)

                    res.status(200).json({ message: `Welcome to our API ${username}`, token })
                } else {
                    res.status(401).json({ message: 'Invalid credentials' })
                }
            })
            .catch(error => {
                res.status(500).json({ message: error.message })
            })
    } else {
        res.status(400).json({
            message: 'please provide username and password and the password shoud be alphanumeric',
        })
    }
})

function createToken(user) {
    const payload = {
        sub: user.id,
        username: user.username,
        department: user.department,
    }

    const secret = process.env.JWT_SECRET || 'keepitsecret,keepitsafe!'

    const options = {
        expiresIn: '1d',
    }
    return jwt.sign(payload, secret, options)
}

module.exports = router