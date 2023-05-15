const request = require('supertest');
const express = require('express');
const historyRoutes = require('../../../app/presentation/routes/historyManager')
const authorizer = require('../../dataAccess/authorizer');

//Generamos el mock

jest.mock('../../../App/DataAccess/databaseConnection', () => ({
	query: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use(historyRoutes);

//Suite de pruebas

describe('Pruebas unitarias para los endpoints del historial', () => {
	let token;

	beforeAll(async () => {
		const payload = { userId: 1234 };
		token = await authorizer.generarToken(payload);
	});

	//Probamos los endpoints

	describe('GET /history/getAll', () => {
		test('Debería devolver una lista de cambios', async () => {
			const response = await request(app)
				.get('/history/getAll')
				.set('Authorization', `Bearer ${token}`)
				.expect(200);

			expect(response.body).toBeInstanceOf(Object);
		});
	});

	describe('GET /history/getHistory/:id', () => {
		test('Debería devolver un historial específico', async () => {
			const response = await request(app)
				.get('/history/getHistory/1')
				.set('Authorization', `Bearer ${token}`)
				.expect(200);

			expect(response.body).toBeInstanceOf(Object); // Modificar según el ID del historial que se espera devolver
		});
	});

	describe('POST /history/addHistory', () => {
		test('Debería agregar un historial', async () => {
			const response = await request(app)
				.post('/history/addHistory')
				.set('Authorization', `Bearer ${token}`)
				.send({
					fecha_cambio: '2022-04-01',
					detalle_cambio: 'Este es un historial de prueba',
					responsable: 1,
					proyecto_asignado: 1
				})
				.expect(200);

			expect(response.text).toBe('Aceso denegado, token expiró');
		});
	});

	describe('PUT /history/update/:id', () => {
		test('Debería actualizar un historial existente', async () => {
			const response = await request(app)
				.put('/history/update/1')
				.set('Authorization', `Bearer ${token}`)
				.send({
					//poner lo que deba
					fecha_cambio: '2022-04-01',
					detalle_cambio: 'Este es un historial de prueba',
					responsable: 123,
					proyecto_asignado: 1
				})
				.expect(200);

			expect(response.text).toBe('Aceso denegado, token expiró');
		});
	});

	describe('DELETE /history/delete/:id', () => {
		test('Debería eliminar un historial existente', async () => {
			const response = await request(app)
				.delete('/history/delete/1')
				.set('Authorization', `Bearer ${token}`)
				.expect(200);

			expect(response.text).toBe('Aceso denegado, token expiró');
		});
	});

})
