const request = require('../Back-End/node_modules/supertest');
const router = require('../Back-End/historyManager');

describe('Historial API', () => {
	let newHistorialId;

	it('should create a new historial record', async () => {
		const newHistorial = {
			fecha_cambio: '2022-03-29',
			detalle_cambio: 'Se modificó la descripción del proyecto',
			responsable: 'Juan Perez',
			proyecto_asignado: 1
		};

		const response = await request(router)
			.post('/historial')
			.send(newHistorial);

		expect(response.statusCode).toBe(200);
		expect(response.text).toBe('Registro de historial agregado exitosamente.');
		expect(response.body).toEqual({});

		newHistorialId = response.body.insertId;
	});

	it('should retrieve a list of historial records', async () => {
		const response = await request(router)
			.get('/historial')
			.set('Authorization', 'Bearer validToken');

		expect(response.statusCode).toBe(200);
		expect(Array.isArray(response.body)).toBe(true);
	});

	it('should retrieve a single historial record by ID', async () => {
		const response = await request(router)
			.get(`/historial/${newHistorialId}`)
			.set('Authorization', 'Bearer validToken');

		expect(response.statusCode).toBe(200);
		expect(response.body[0]).toHaveProperty('id', newHistorialId);
	});

	it('should update a historial record by ID', async () => {
		const updatedHistorial = {
			fecha_cambio: '2022-03-30',
			detalle_cambio: 'Se modificó la fecha de entrega del proyecto',
			responsable: 'Maria Gonzalez',
			proyecto_asignado: 1
		};

		const response = await request(router)
			.put(`/historial/${newHistorialId}`)
			.send(updatedHistorial)
			.set('Authorization', 'Bearer validToken');

		expect(response.statusCode).toBe(200);
		expect(response.text).toBe('Registro de historial actualizado exitosamente.');
		expect(response.body).toEqual({});
	});

	it('should delete a historial record by ID', async () => {
		const response = await request(router)
			.delete(`/historial/${newHistorialId}`)
			.set('Authorization', 'Bearer validToken');

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({ message: 'Historial eliminado' });
	});
});