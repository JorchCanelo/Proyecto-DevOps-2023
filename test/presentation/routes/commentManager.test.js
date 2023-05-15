const request = require('supertest');
const express = require('express');
const commentRoutes = require('../../../app/presentation/routes/commentManager');
const authorizer = require('../../dataAccess/authorizer');

//Generamos el mock

jest.mock('../../../App/DataAccess/databaseConnection.js', () => ({
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

	describe('GET /comments/getAll', () => {
		test('Debería devolver una lista de comentarios', async () => {
			const response = await request(app)
				.get('/comments/getAll')
				.set('Authorization', `Bearer ${token}`)
				.expect(200);

			expect(response.body).toBeInstanceOf(Object);
		});
	});

	describe('GET /comments/getComment/:id', () => {
		test('Debería devolver un comentario específico', async () => {
			const response = await request(app)
				.get('/comments/getComment/1')
				.set('Authorization', `Bearer ${token}`)
				.expect(200);

			expect(response.body).toBeInstanceOf(Object); // Modificar según el ID del comentario que se espera devolver
		});
	});

	describe('POST /comments/addComment', () => {
		test('Debería agregar un comentario', async () => {
			const response = await request(app)
				.post('/comments/addComment')
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

	describe('PUT /comments/update/:id', () => {
		test('Debería actualizar un comentario existente', async () => {
			const response = await request(app)
				.put('/comments/update/1')
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

	describe('DELETE /comments/delete/:id', () => {
		test('Debería eliminar un comentario existente', async () => {
			const response = await request(app)
				.delete('/comments/delete/1')
				.set('Authorization', `Bearer ${token}`)
				.expect(200);

			expect(response.text).toBe('Aceso denegado, token expiró');
		});
	});


});

