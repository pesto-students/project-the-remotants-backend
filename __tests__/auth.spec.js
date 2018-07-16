import { getDbClient, getDb } from '../src/testDatabase';
import { registerUser, loginUser } from '../src/routes/auth';
import { testConstants } from '../src/config/constants';
import { updateUser } from '../src/routes/dashboard';


describe('Testing auth functionalities', () => {
  let db;
  const collection = testConstants.TEST_USERS_COLLECTION;

  beforeAll(async () => {
    db = await getDb();
  });

  afterAll(async () => {
    const client = await getDbClient();
    client.close();
  });

  describe('Test authentication', () => {
    const email = `test${Math.random() * 100}@gmail.com`;
    const updatedUserInfo = {
      username: `MyHandle${Math.random() * 100}`,
      name: `MyName${Math.random() * 100}`,
    };
    test('should add user', async () => {
      const userInfo = {
        email,
        password: 'password123',
      };
      expect(await registerUser(db, collection, userInfo))
        .toHaveProperty('success', true);
    });

    test('should update existing user', async () => {
      expect(await updateUser(db, collection, email, updatedUserInfo)).toHaveProperty('success', true);
    });

    test('should not update for existing username', async () => {
      expect(await updateUser(db, collection, 'random@xyz.com', updatedUserInfo)).toHaveProperty(
        'errors',
        { name: 'Username already exists' },
      );
    });

    test('should not add existing user', async () => {
      const userInfo = {
        email: '3@remotants.com',
        password: 'saumya',
      };
      expect(await registerUser(db, collection, userInfo))
        .not.toHaveProperty('success', true);
    });

    test('should login user', async () => {
      const userInfo = {
        email: '3@remotants.com',
        password: 'saumya',
      };
      expect(await loginUser(db, collection, userInfo))
        .toHaveProperty('success', true);
    });

    test('should not login user with incorrect credentials', async () => {
      const invalidEmail = `test${Math.random() * 100}@gmail.com`;
      const userInfo = {
        invalidEmail,
        password: 'password123',
      };
      expect(await loginUser(db, collection, userInfo))
        .not.toHaveProperty('success', true);
    });
  });
});
