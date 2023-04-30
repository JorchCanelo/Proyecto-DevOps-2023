// Importamos los módulos necesarios
const request = require('supertest');
const express = require('express');
const commentRoutes = require('../../../App/Presentation/Routes/commentManager');
// const mockConnection = require('../../DataAccess/MockConnection');
const authorizer = require('../../DataAccess/Authorizer');

const mockConnection = {
	query: jest.fn()
};

// Mockeamos la conexión a la base de datos
jest.mock('../../../App/DataAccess/DBConnection', () => mockConnection);

// Creamos una instancia de express y le agregamos los middlewares y rutas necesarias
const app = express();
app.use(express.json());
app.use(commentRoutes);

describe('Pruebas unitarias para los endpoints de comentarios', () => {
	let token;

	beforeAll(async () => {
		token = await authorizer.generarToken();
	});

	describe('GET /comentarios', () => {
		test('debería devolver una lista de comentarios', async () => {
			// Hacemos una petición HTTP a nuestra aplicación utilizando supertest
			const response = await request(app)
				.get('/comentarios')
				.set('Authorization', `Bearer ${token}`)
				.expect(200);

			// Verificamos que la respuesta contenga una lista de comentarios
			expect(response.body).toBeInstanceOf(Array);
			expect(response.body.length).toBeGreaterThan(0);
		});
	});

	// Agrega más pruebas unitarias aquí
});




// const request = require('supertest')
// const app = require('../../../App/Presentation/Routes/commentManager');
// const mockConnection = require('../../DataAccess/MockConnection');
// const authorizer = require('../../DataAccess/Authorizer');

// jest.mock('../../../App/DataAccess/DBConnection', () => mockConnection);

// describe('Pruebas unitarias para los endpoints de comentarios', () => {
// 	let token;

// 	beforeAll(async () => {
// 		token = await authorizer.generarToken();
// 	});

// 	describe('GET /comentarios', () => {
// 		test('debería devolver una lista de comentarios', async () => {
// 			const response = await request(app)
// 				.get('/comentarios')
// 				.set('Authorization', `Bearer ${token}`)
// 				.expect(200);

// 			expect(response.body).toHaveLength(3); // Modificar según el número de comentarios que se espera devolver
// 		});
// 	});

// 	describe('GET /comentarios/:id', () => {
// 		test('debería devolver un comentario específico', async () => {
// 			const response = await request(app)
// 				.get('/comentarios/1')
// 				.set('Authorization', `Bearer ${token}`)
// 				.expect(200);

// 			expect(response.body[0].id).toBe(1); // Modificar según el ID del comentario que se espera devolver
// 		});
// 	});

// 	describe('POST /comentarios', () => {
// 		test('debería agregar un comentario', async () => {
// 			const response = await request(app)
// 				.post('/comentarios')
// 				.set('Authorization', `Bearer ${token}`)
// 				.send({
// 					autor: 'Juan',
// 					contenido: 'Este es un comentario de prueba',
// 					fecha: '2022-04-01',
// 					estado: 'pendiente',
// 					tarea_asociada: 1
// 				})
// 				.expect(200);

// 			expect(response.text).toBe('Comentario agregado exitosamente.');
// 		});
// 	});

// 	describe('PUT /comentarios/:id', () => {
// 		test('debería actualizar un comentario existente', async () => {
// 			const response = await request(app)
// 				.put('/comentarios/1')
// 				.set('Authorization', `Bearer ${token}`)
// 				.send({
// 					autor: 'Juan',
// 					contenido: 'Este es un comentario actualizado',
// 					fecha: '2022-04-01',
// 					estado: 'completado',
// 					tarea_asociada: 1
// 				})
// 				.expect(200);

// 			expect(response.text).toBe('Comentario actualizado exitosamente.');
// 		});
// 	});

// 	describe('DELETE /comentarios/:id', () => {
// 		test('debería eliminar un comentario existente', async () => {
// 			const response = await request(app)
// 				.delete('/comentarios/1')
// 				.set('Authorization', `Bearer ${token}`)
// 				.expect(200);

// 			expect(response.text).toBe('Comentario eliminado exitosamente.');
// 		});
// 	});
// });