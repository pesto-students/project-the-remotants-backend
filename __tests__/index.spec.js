import request from 'supertest';

import app from '../src';
import routes from '../src/config/routes';


describe('loading express', () => {
  let server;
  beforeEach(() => {
    server = app;
  });
  afterEach(() => {
    server.close();
  });
  test('responds to /', (done) => {
    request(server)
      .get(routes.Home)
      .expect(200, done);
  });
  test('404 everything else', (done) => {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
  test('responds to /test', (done) => {
    request(server)
      .get(routes.Test)
      .expect(200, {
        status: 'Working!',
      }, done);
  });
});
