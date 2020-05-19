const router = require('express').Router()

const Users = require('./usersModel.js')
const restricted = require('../auth/restrictedMiddleware.js')
const { isValid } = require('./usersService.js')

router.use(restricted)

router.get('/', (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).json({ users, jwt: req.jwt })
    })
    .catch(err => res.send(err))
})

// only accounts with the admin role can create users
router.post('/', checkRoles(['admin']), (req, res) => {
  const user = req.body

  if (isValid(user)) {
    Users.add(user)
      .then(saved => {
        res.status(201).json({ data: saved })
      })
      .catch(error => {
        res.status(500).json({ message: error.message })
      })
  } else {
    res.status(400).json({ message: 'please provide all user information' })
  }
})

module.exports = router