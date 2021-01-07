const userJohnDoe = {name: 'John Doe', username: 'john', _id: 'JOHN_DOE_ID'}
const tokenJohnDoe = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkpPSE5fRE9FX0lEIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNjA5OTcxNjA5LCJleHAiOjE2NDE1Mjg1MzV9.fiRAkHzuIug--Ej5c4M25hSNHz2a5XbvKZW01JIWy30"

const userJaneDoe = {name: 'Jane Doe', username: 'jane', _id: 'JANE_DOE_ID'}
const tokenJaneDoe = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkpBTkVfRE9FX0lEIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNjA5OTcxNjA5LCJleHAiOjE2NDE1Mjg1MzV9.QgqWY9rCmLRQOsq2gydlTnjQ2xGEy6fM7ZcWdKrmjGY"

const mockGetUser = async userId => {
    return new Promise((resolve, reject) => {
        if (userId === userJohnDoe._id) {
            return resolve(userJohnDoe)
        } else if (userId === userJaneDoe._id) {
            return resolve(userJaneDoe)
        } else {
            reject(`UserId ${userId} not found`)
        }

    })
}

module.exports = {
    userJohnDoe,
    userJaneDoe,
    tokenJohnDoe,
    tokenJaneDoe,
    mockGetUser
}