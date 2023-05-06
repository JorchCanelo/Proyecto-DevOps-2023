const request = require('supertest');
const express = require('express');
const projectRoutes = require('../../../app/presentation/routes/projectManager');
const authorizer = require('../../dataAccess/authorizer');

//Generamos el mock

jest.mock('../../../App/DataAccess/databaseConnection', () => ({
	query: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use(projectRoutes);

//Suite de pruebas

describe('Pruebas unitarias para los endpoints de proyectos', () => {
	let token;

	beforeAll(async () => {
		const payload = { userId: 1234 };
		token = await authorizer.generarToken(payload);
	});

	//Probamos los endpoints

	describe('GET /proyectos', () => {
		test('Debería devolver una lista de proyectos', async () => {
			const response = await request(app)
				.get('/proyectos')
				.set('Authorization', `Bearer ${token}`)
				.expect(200);

			expect(response.body).toBeInstanceOf(Object);
		});
	});

	describe('GET /proyectos/:id', () => {
		test('Debería devolver un proyecto específico', async () => {
			const response = await request(app)
				.get('/proyectos/1')
				.set('Authorization', `Bearer ${token}`)
				.expect(200);

			expect(response.body).toBeInstanceOf(Object); // Modificar según el ID del comentario que se espera devolver
		});
	});

	describe('POST /proyectos', () => {
		test('Debería agregar un proyecto', async () => {
			const response = await request(app)
				.post('/proyectos')
				.set('Authorization', `Bearer ${token}`)
				.send({
					fecha_cambio: '2022-04-01',
					detalle_cambio: 'Amongus',
					responsable: 2,
					proyecto_asociado: 3
				})
				.expect(200);

			expect(response.text).toBe('Aceso denegado, token expiró');
		});
	});

	describe('PUT /proyectos/:id', () => {
		test('Debería actualizar un proyecto', async () => {
			const response = await request(app)
				.put('/proyectos/1')
				.set('Authorization', `Bearer ${token}`)
				.send({
					fecha_cambio: '2022-04-01',
					detalle_cambio: 'Amongus',
					responsable: 2,
					proyecto_asociado: 3
				})
				.expect(200);

			expect(response.text).toBe('Aceso denegado, token expiró');
		});
	});

	describe('PUT /proyectos/:id', () => {
		test('Debería actualizar un proyecto existente', async () => {
			const response = await request(app)
				.put('/proyectos/1')
				.set('Authorization', `Bearer ${token}`)
				.send({
					fecha_cambio: '2022-04-01',
					detalle_cambio: 'Amongus',
					responsable: 2,
					proyecto_asociado: 3
				})
				.expect(200);

			expect(response.text).toBe('Aceso denegado, token expiró');
		});
	});

	describe('DELETE /proyectos/:id', () => {
		test('Debería eliminar un proyecto existente', async () => {
			const response = await request(app)
				.delete('/proyectos/1')
				.set('Authorization', `Bearer ${token}`)
				.expect(200);

			expect(response.text).toBe('Aceso denegado, token expiró');
		});
	});

});

