process.env.PORT = 5002
const app = require('../server')
const request = require('supertest');

const baseUrl = '/api/messages'

describe('GET /api/messages/global', () => {

    it('should return Unauthorized(401) when the request does not have the Authorization header',  async () => {
        return request( app )
            .get(baseUrl + '/global')
            .expect('Content-Type', /json/)
            .expect(401)
            .then(response => {
                expect(response.body).toEqual({"message": "Unauthorized"})
            })
    });

});