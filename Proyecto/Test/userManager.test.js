const request = require('supertest');
const express = require('express');
const router = require('../router');

const app = express();
app.use(express.json());
app.use('/', router);

describe('Test the authentication endpoints', () => {
  test('It should register a new user', async () => {
    const response = await request(app).post('/register').send({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password',
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Registro exitoso');
  });

  test('It should authenticate a user', async () => {
    const response = await request(app).post('/login').send({
      username: 'testuser',
      password: 'password',
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Usuario autenticado');
    expect(response.header.authorization).toBeTruthy();
  });

  test('It should return a list of all users', async () => {
    const response = await request(app).get('/usuarios');
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('It should return a specific user by id', async () => {
    const response = await request(app).get('/usuarios/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
  });

  test('It should update a specific user by id', async () => {
    const response = await request(app).put('/usuarios/1').send({
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
    const response = await request(app).delete('/usuarios/1');
    expect(response.statusCode).toBe(204);
  });
});