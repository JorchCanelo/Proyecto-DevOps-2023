const request = require('../Back-End/node_modules/supertest');
const router = require('../Back-End/userManager');

describe('Test the authentication endpoints', () => {
  test('It should register a new user', async () => {
    const response = await request(router).post('/register').send({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password',
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Registro exitoso');
  });

  test('It should authenticate a user', async () => {
    const response = await request(router).post('/login').send({
      username: 'testuser',
      password: 'password',
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Usuario autenticado');
    expect(response.header.authorization).toBeTruthy();
  });

  test('It should return a list of all users', async () => {
    const response = await request(router).get('/usuarios');
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('It should return a specific user by id', async () => {
    const response = await request(router).get('/usuarios/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
  });

  test('It should update a specific user by id', async () => {
    const response = await request(router).put('/usuarios/1').send({
      username: 'newusername',
      email: 'newemail@example.com',
      password: 'newpassword',
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
    expect(response.body).toHaveProperty('username', 'newusername');
    expect(response.body).toHaveProperty('email', 'newemail@example.com');
    expect(response.body).toHaveProperty('password', 'newpassword');
  });

  test('It should delete a specific user by id', async () => {
    const response = await request(router).delete('/usuarios/1');
    expect(response.statusCode).toBe(204);
  });
});