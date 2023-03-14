const User = require('../../models/client')
const UserService = require('./UserServiceGoogle')

module.exports = UserService(User)