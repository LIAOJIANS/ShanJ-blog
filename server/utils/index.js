const boom = require('boom')
const { validationResult } = require('express-validator')
function errorChecking(next, req, cb) {
  const err = validationResult(req)
  if(!err.isEmpty()) {
    const [{ msg }] = err.errors
    next(boom.badRequest(msg))
  } else {
    cb && cb()
  }
}

function getClientIP(req) {
  return req.headers['x-forwarded-for'] || 
      req.connection.remoteAddress || 
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
};

module.exports = {
  errorChecking,
  getClientIP
}
