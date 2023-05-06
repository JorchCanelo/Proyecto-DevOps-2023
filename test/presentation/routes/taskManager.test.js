const request = require('supertest');
const express = require('express');
const taskRoutes = require('../../../app/presentation/routes/taskManager');
const authorizer = require('../../dataAccess/authorizer');

//Generamos el mock

jest.mock('../../../App/DataAccess/databaseConnection', () => ({
	query: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use(taskRoutes);

//Suite de pruebas

describe('Pruebas unitarias para los endpoints de tareas', () => {
	let token;

	beforeAll(async () => {
		const payload = { userId: 1234 };
		token = await authorizer.generarToken(payload);
	});

	//Probamos los endpoints

	describe('GET /tareas', () => {
		test('Debería devolver una lista de tareas', async () => {
			const response = await request(app)
				.get('/tareas')
				.set('Authorization', `Bearer ${token}`)
				.expect(200);

			expect(response.body).toBeInstanceOf(Object);
		});
	});

	describe('GET /tareas/:id', () => {
		test('Debería devolver una tarea específico', async () => {
			const response = await request(app)
				.get('/tareas/1')
				.set('Authorization', `Bearer ${token}`)
				.expect(200);

			expect(response.body).toBeInstanceOf(Object); // Modificar según el ID del comentario que se espera devolver
		});
	});

	describe('POST /tareas', () => {
		test('Debería agregar una tarea', async () => {
			const response = await request(app)
				.post('/tareas')
				.set('Authorization', `Bearer ${token}`)
				.send({
					nombre: 'Juan',
					descripcion: 'Este es una tarea de prueba',
					estado: 'pendiente',
					fecha_entregaa: '2022-04-01',
					proyecto_asociado: 123
				})
				.expect(200);

			expect(response.text).toBe('Aceso denegado, token expiró');
		});
	});

	describe('PUT /tareas/:id', () => {
		test('Debería actualizar una tarea existente', async () => {
			const response = await request(app)
				.put('/tareas/1')
				.set('Authorization', `Bearer ${token}`)
				.send({
					nombre: 'Juan',
					descripcion: 'Este es una tarea de prueba',
					estado: 'pendiente',
					fecha_entregaa: '2022-04-01',
					proyecto_asociado: 123
				})
				.expect(200);

			expect(response.text).toBe('Aceso denegado, token expiró');
		});
	});

	describe('PUT /tareas/:id', () => {
		test('Debería actualizar una tarea existente', async () => {
			const response = await request(app)
				.put('/tareas/1')
				.set('Authorization', `Bearer ${token}`)
				.send({
					nombre: 'Juan',
					descripcion: 'Este es una tarea de prueba',
					estado: 'pendiente',
					fecha_entregaa: '2022-04-01',
					proyecto_asociado: 123
				})
				.expect(200);

			expect(response.text).toBe('Aceso denegado, token expiró');
		});
	});

	describe('DELETE /tareas/:id', () => {
		test('Debería eliminar una tarea existente', async () => {
			const response = await request(app)
				.delete('/tareas/1')
				.set('Authorization', `Bearer ${token}`)
				.expect(200);

			expect(response.text).toBe('Aceso denegado, token expiró');
		});
	});


});

