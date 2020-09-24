const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
  host:"smtp.mailtrap.io",
  port: 2525,
  auth:{
    user: "f865f980cc7fb2",
    pass: "dcab3640869e73"
  }
})