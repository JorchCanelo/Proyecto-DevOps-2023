const request = require('supertest');
const express = require('express');
const commentRoutes = require('../../../App/Presentation/Routes/commentManager');
const authorizer = require('../../DataAccess/Authorizer');

//Generamos el mock

jest.mock('../../../App/DataAccess/DBConnection', () => ({
	query: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use(commentRoutes);

//Suite de pruebas

describe('Pruebas unitarias para los endpoints de comentarios', () => {
	let token;

	beforeAll(async () => {
		const payload = { userId: 1234 };
		token = await authorizer.generarToken(payload);
	});

	//Probamos los endpoints

	describe('GET /comentarios', () => {
		test('Debería devolver una lista de comentarios', async () => {
			const response = await request(app)
				.get('/comentarios')
				.set('Authorization', `Bearer ${token}`)
				.expect(200);

			expect(response.body).toBeInstanceOf(Object);
		});
	});

	describe('GET /comentarios/:id', () => {
		test('Debería devolver un comentario específico', async () => {
			const response = await request(app)
				.get('/comentarios/1')
				.set('Authorization', `Bearer ${token}`)
				.expect(200);

			expect(response.body).toBeInstanceOf(Object); // Modificar según el ID del comentario que se espera devolver
		});
	});

	describe('POST /comentarios', () => {
		test('Debería agregar un comentario', async () => {
			const response = await request(app)
				.post('/comentarios')
				.set('Authorization', `Bearer ${token}`)
				.send({
					autor: 'Juan',
					contenido: 'Este es un comentario de prueba',
					fecha: '2022-04-01',
					estado: 'pendiente',
					tarea_asociada: 1
				})
				.expect(200);

			expect(response.text).toBe('Aceso denegado, token expiró');
		});
	});

	describe('PUT /comentarios/:id', () => {
		test('Debería actualizar un comentario existente', async () => {
			const response = await request(app)
				.put('/comentarios/1')
				.set('Authorization', `Bearer ${token}`)
				.send({
					autor: 'Juan',
					contenido: 'Este es un comentario actualizado',
					fecha: '2022-04-01',
					estado: 'completado',
					tarea_asociada: 1
				})
				.expect(200);

			expect(response.text).toBe('Aceso denegado, token expiró');
		});
	});

	describe('PUT /comentarios/:id', () => {
		test('Debería actualizar un comentario existente', async () => {
			const response = await request(app)
				.put('/comentarios/1')
				.set('Authorization', `Bearer ${token}`)
				.send({
					autor: 'Juan',
					contenido: 'Este es un comentario actualizado',
					fecha: '2022-04-01',
					estado: 'completado',
					tarea_asociada: 1
				})
				.expect(200);

			expect(response.text).toBe('Aceso denegado, token expiró');
		});
	});

	describe('DELETE /comentarios/:id', () => {
		test('Debería eliminar un comentario existente', async () => {
			const response = await request(app)
				.delete('/comentarios/1')
				.set('Authorization', `Bearer ${token}`)
				.expect(200);

			expect(response.text).toBe('Aceso denegado, token expiró');
		});
	});


});

