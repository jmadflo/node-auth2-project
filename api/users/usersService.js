module.exports = {
    isValidRegister,
    isValidLogin
}

function isValidRegister(user) {
    return Boolean(user.username && user.password && user.department && typeof user.password === "string")
}

// we don't want a department input when we login
function isValidLogin(user) {
    return Boolean(user.username && user.password && typeof user.password === "string")
}