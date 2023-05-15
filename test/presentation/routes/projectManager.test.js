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

	describe('GET /projects/getAll', () => {
		test('Debería devolver una lista de proyectos', async () => {
			const response = await request(app)
				.get('/projects/getAll')
				.set('Authorization', `Bearer ${token}`)
				.expect(200);

			expect(response.body).toBeInstanceOf(Object);
		});
	});

	describe('GET /projects/getProject/:id', () => {
		test('Debería devolver un proyecto específico', async () => {
			const response = await request(app)
				.get('/projects/getProject/1')
				.set('Authorization', `Bearer ${token}`)
				.expect(200);

			expect(response.body).toBeInstanceOf(Object); // Modificar según el ID del comentario que se espera devolver
		});
	});

	describe('POST /projects/addProject', () => {
		test('Debería agregar un proyecto', async () => {
			const response = await request(app)
				.post('/projects/addProject')
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

	describe('PUT /projects/update/:id', () => {
		test('Debería actualizar un proyecto', async () => {
			const response = await request(app)
				.put('/projects/update/1')
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

	describe('DELETE /projects/delete/:id', () => {
		test('Debería eliminar un proyecto existente', async () => {
			const response = await request(app)
				.delete('/projects/delete/1')
				.set('Authorization', `Bearer ${token}`)
				.expect(200);

			expect(response.text).toBe('Aceso denegado, token expiró');
		});
	});

});

