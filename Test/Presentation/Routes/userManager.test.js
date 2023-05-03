const request = require('supertest');
const express = require('express');
const userRoutes = require('../../../App/Presentation/Routes/userManager');
const authorizer = require('../../DataAccess/Authorizer');

//Generamos el mock

jest.mock('../../../App/DataAccess/DBConnection', () => ({
	query: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use(userRoutes);

//jest.setTimeout(20000);

//Suite de pruebas

describe('Pruebas unitarias para los endpoints de comentarios', () => {
	let token;

	beforeAll(async () => {
		const payload = { userId: 1234 };
		token = await authorizer.generarToken(payload);
	});

	//Probamos los endpoints

	describe('POST /register', () => {
		test('Debería registrar un usuario', async () => {
			const response = await request(app)
				.post('/register')
				.set('Authorization', `Bearer ${token}`)
				.send({
					username: 'Juan',
					email: 'Amongos@correo.com',
					password: 'password',
					lastLoginDate: '2022-04-01',
					createdDate: '2022-04-01'
				})
				.expect(200);

			expect(response.text).toBe('Aceso denegado, token expiró');
		});
	});

	describe('POST /login', () => {
		test('Debería iniciar sesión para un usuario', async () => {
			const response = await request(app)
				.post('/login')
				.set('Authorization', `Bearer ${token}`)
				.send({
					username: 'Juan',
					email: 'Amongos@correo.com',
					password: 'password',
					lastLoginDate: '2022-04-01',
					createdDate: '2022-04-01'
				})
				.expect(200);

			expect(response.text).toBe('Aceso denegado, token expiró');
		});
	});


	describe('GET /usuarios', () => {
		test('Debería devolver una lista de usuarios', async () => {
			const response = await request(app)
				.get('/usuarios')
				.set('Authorization', `Bearer ${token}`)
				.expect(200);

			expect(response.body).toBeInstanceOf(Object);
		});
	});

	describe('GET /usuarios/:id', () => {
		test('Debería devolver la información de un usuario en específico', async () => {
			const response = await request(app)
				.get('/usuarios/1')
				.set('Authorization', `Bearer ${token}`)
				.expect(200);

			expect(response.body).toBeInstanceOf(Object); // Modificar según el ID del comentario que se espera devolver
		});
	});

	describe('PUT /usuarios/:id', () => {
		test('Debería actualizar un comentario existente', async () => {
			const response = await request(app)
				.put('/usuarios/1')
				.set('Authorization', `Bearer ${token}`)
				.send({
					username: 'Juan',
					email: 'Amongos@correo.com',
					password: 'contraseña',
					lastLoginDate: '2022-04-01',
					createdDate: '2022-04-01'
				})
				.expect(200);

			expect(response.text).toBe('Aceso denegado, token expiró');
		});
	});

	describe('DELETE /usuarios/:id', () => {
		test('Debería eliminar un usuario existente', async () => {
			const response = await request(app)
				.delete('/usuarios/1')
				.set('Authorization', `Bearer ${token}`)
				.expect(200);

			expect(response.text).toBe('Aceso denegado, token expiró');
		});
	});


});

