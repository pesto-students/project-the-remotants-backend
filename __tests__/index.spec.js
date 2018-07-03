const request = require('supertest');

const app = require('../src');

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
      .get('/')
      .expect(200, done);
  });
  test('404 everything else', (done) => {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
  test('responds to /test', (done) => {
    request(server)
      .get('/test')
      .expect(200, {
        status: 'Working!',
      }, done);
  });
});
