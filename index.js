const server = require('./api/server')

const PORT = process.env.PORT || 8000

server.listen(8000, () => {
    console.log(`Server is listening on port ${8000}`)
})