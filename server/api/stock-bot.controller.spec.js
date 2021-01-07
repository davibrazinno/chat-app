process.env.PORT = 5001
const app = require('../server')
const request = require('supertest');
const rabbitmq = require('../utilities/rabbitmq')
const UserService = require('../api/users.service')
const {tokenJohnDoe, tokenJaneDoe, userJaneDoe, userJohnDoe, mockGetUser} = require('../utilities/test.fixtures')

const baseUrl = '/api/stock-bot'

let sendToQueueSpy

beforeAll(() => {
    jest.spyOn(UserService, 'getUser').mockImplementation((userId) => mockGetUser(userId))
    sendToQueueSpy = jest.spyOn(rabbitmq, 'sendToQueue');
    sendToQueueSpy.mockReturnValue({})
})

describe('POST /api/stock-bot', () => {
    const mockGlobalRequest = {
        stock: 'aapl.us',
        scope: 'Global Chat',
    }

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should return Unauthorized when the request does not have the Authorization header',  async () => {
        return request(app)
            .post(baseUrl)
            .send(mockGlobalRequest)
            .expect(401)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toEqual({"message": "Unauthorized"})
            })
    });

    it('should return Unauthorized when the request token is invalid',  async () => {
        return request(app)
            .post(baseUrl)
            .set('Authorization', "Bearer INVALID_TOKEN")
            .send(mockGlobalRequest)
            .expect(401)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toEqual({"message": "Unauthorized"})
            })
    });

    it('should queue a global request when authorized',  async () => {
        return request(app)
            .post(baseUrl)
            .set('Authorization', tokenJohnDoe)
            .send(mockGlobalRequest)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toEqual({"message": "Success"})
                expect(sendToQueueSpy).toHaveBeenCalledTimes(1)
                expect(sendToQueueSpy).toHaveBeenCalledWith("STOCK_QUOTES", {
                    scope: 'Global Chat',
                    stock: 'aapl.us',
                    to: 'JOHN_DOE_ID'
                })
            })
    });

    it('should queue a conversation request when authorized', async () => {
        const mockConversationRequest = {
            stock: 'aapl.us',
            scope: userJohnDoe
        }
        return request(app)
            .post(baseUrl)
            .set('Authorization', tokenJaneDoe)
            .send(mockConversationRequest)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toEqual({"message": "Success"})
                expect(sendToQueueSpy).toHaveBeenCalledTimes(1)
                expect(sendToQueueSpy).toHaveBeenCalledWith("STOCK_QUOTES", {
                    scope: mockConversationRequest.scope,
                    stock: 'aapl.us',
                    to: userJaneDoe._id
                })
            })
    });

});