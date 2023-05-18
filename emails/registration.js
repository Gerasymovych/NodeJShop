const keys = require('../keys')

module.exports = function(to) {
    return {
        to,
        from: keys.EMAIL_FROM,
        subject: 'New user registration',
        html: `
        <h1>Welcome ${to}!</h1>
        <p>Your account succesfully created</p>  
        `
    }
}