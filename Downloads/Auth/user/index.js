const User = require('../models/client')
const UserService = require('./user.service')

module.exports = UserService(User)