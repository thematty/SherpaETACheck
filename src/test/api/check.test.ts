// tslint:disable: only-arrow-functions

import 'mocha';
import request from 'supertest';

import app from '../../server';

describe('Endpoint /api/check', () => {
  it('should return response on call', function(done) {
    request(app)
      .get('/api/check')
      .expect(200, done);
  });
});

describe('Endpoint *', () => {
  it('should return 404', function(done) {
    request(app)
      .get('/not-found?{"nationality": "USA","passportNumber": "494061902","referenceNumber": "79968076","dateOfBirth": "1979-08-23"}')
      .expect(404, done);
  });
});
