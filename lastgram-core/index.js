global.__lgVersion = require('../package.json').version.split('-')
require('./src/.')
require('./src/translation')
global.__lgPath = __dirname

module.exports = 0
