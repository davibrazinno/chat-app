process.env.PORT = 5001
const app = require('../server')
const request = require('supertest');
const jwt = require('jsonwebtoken');
const rabbitmq = require('../utilities/rabbitmq')

const baseUrl = '/api/stock-bot'

describe('POST /api/stock-bot', () => {
    const mockGlobalRequest = {
        stock: 'aapl.us',
        scope: 'Global Chat',
    }
    const mockConversationRequest = {
        stock: 'aapl.us',
        scope: {
            _id: 'USER_ID',
            name: 'User Name',
            username: 'username'}
    }
    const sendToQueueSpy = jest.spyOn(rabbitmq, ['sendToQueue']);
    const jwtSpy = jest.spyOn(jwt, 'verify');

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should return Unauthorized(401) when the request does not have the Authorization header',  async () => {
        return request(app)
            .post(baseUrl)
            .send(mockGlobalRequest)
            .expect('Content-Type', /json/)
            .expect(401)
            .then(response => {
                expect(response.body).toEqual({"message": "Unauthorized"})
            })
    });

    it('should return Unauthorized(401) when the request token is invalid',  async () => {
        jwtSpy.mockImplementationOnce(() => {
            throw new Error('Invalid access token')
        });

        return request(app)
            .post(baseUrl)
            .send(mockGlobalRequest)
            .expect('Content-Type', /json/)
            .expect(401)
            .then(response => {
                expect(response.body).toEqual({"message": "Unauthorized"})
            })
    });

    it('should queue a global request when authorized',  async () => {
        jwtSpy.mockReturnValue('Some decoded token');

        return request(app)
            .post(baseUrl)
            .send(mockGlobalRequest)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                expect(response.body).toEqual({"message": "Success"})
                expect(sendToQueueSpy).toHaveBeenCalledTimes(1)
                expect(sendToQueueSpy).toHaveBeenCalledWith("STOCK_QUOTES", {
                    scope: 'Global Chat',
                    stock: 'aapl.us'
                })
            })
    });

    it('should queue a conversation request when authorized', async () => {
        jwtSpy.mockReturnValue('Some decoded token');

        return request(app)
            .post(baseUrl)
            .send(mockConversationRequest)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                expect(response.body).toEqual({"message": "Success"})
                expect(sendToQueueSpy).toHaveBeenCalledTimes(1)
                expect(sendToQueueSpy).toHaveBeenCalledWith("STOCK_QUOTES", {
                    scope: mockConversationRequest.scope,
                    stock: 'aapl.us'
                })
            })
    });

});