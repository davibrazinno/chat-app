process.env.PORT = 5002
const app = require('../server')
const request = require('supertest');
const UserService = require('../api/users.service')
const MessagesService = require('../api/messages.service')
const {tokenJohnDoe, mockGetUser} = require('../utilities/test.fixtures')

const baseUrl = '/api/messages'

const mockGlobalMessages = ['any mock here']

beforeAll(() => {
    jest.spyOn(UserService, 'getUser').mockImplementation((userId) => mockGetUser(userId))
    jest.spyOn(MessagesService, 'getGlobalMessages').mockReturnValue(mockGlobalMessages)
})

describe('GET /api/messages/global', () => {

    it('should return Unauthorized when the request does not have the Authorization header',  async () => {
        return request( app )
            .get(baseUrl + '/global')
            .expect(401)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toEqual({"message": "Unauthorized"})
            })
    });

    it('should return Unauthorized when the request token is invalid',  async () => {
        return request(app)
            .get(baseUrl + '/global')
            .set('Authorization', "Bearer INVALID_TOKEN")
            .expect(401)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toEqual({"message": "Unauthorized"})
            })
    });

    it('should return global messages when the token is valid',  async () => {
        return request(app)
            .get(baseUrl + '/global')
            .set('Authorization', tokenJohnDoe)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toEqual(mockGlobalMessages)
            })
    });

});