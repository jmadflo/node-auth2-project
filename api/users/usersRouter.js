const router = require('express').Router()

const Users = require('./usersModel.js')
const restricted = require('../auth/restrictedMiddleware.js')


router.use(restricted)

router.get('/', (req, res) => {
    console.log(req.jwt)
    
    // Stretch: we only want users to be able to see users from the same department, so we filter the list of users accordingly
    Users.findBy({ department: req.jwt.department })
        .then(users => {
            res.status(200).json({ users, jwt: req.jwt })
        })
        .catch(err => res.send(err))
})

module.exports = router