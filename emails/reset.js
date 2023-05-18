const keys = require('../keys')
const {BASE_URL} = require("../keys");

module.exports = function(to, token) {
    return {
        to,
        from: keys.EMAIL_FROM,
        subject: 'Password reset',
        html: `
        <h1>Restore account access</h1>
        <p>To restore access to your account  follow this link:</p>  
        <p><a href="${BASE_URL}/auth/password-reset/${token}">Restore</a></p>
        `
    }
}