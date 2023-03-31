const request = require('../Back-End/node_modules/supertest');
const router = require('../Back-End/projectManager');

describe('GET /proyectos', () => {
	it('responds with a list of projects', (done) => {
		request(router)
			.get('/proyectos')
			.set('Authorization', 'Bearer <token>')
			.expect(200)
			.then((response) => {
				expect(Array.isArray(response.body)).toBe(true);
				expect(response.body.length).toBeGreaterThan(0);
				done();
			});
	});
});

describe('GET /proyectos/:id', () => {
	it('responds with a specific project', (done) => {
		const projectId = 1;
		request(router)
			.get(`/proyectos/${projectId}`)
			.set('Authorization', 'Bearer <token>')
			.expect(200)
			.then((response) => {
				expect(response.body.length).toBe(1);
				expect(response.body[0].id).toBe(projectId);
				done();
			});
	});
});

describe('POST /proyectos', () => {
	it('adds a new project', (done) => {
		const newProject = {
			nombre: 'Nuevo proyecto',
			descripcion: 'Descripción del nuevo proyecto',
			materia: 'Materia del nuevo proyecto',
			fecha_entrega: '2023-04-30',
			usuario_asignado: 'Usuario asignado al nuevo proyecto',
		};
		request(router)
			.post('/proyectos')
			.set('Authorization', 'Bearer <token>')
			.send(newProject)
			.expect(200)
			.then((response) => {
				expect(response.text).toBe('Proyecto agregado exitosamente.');
				done();
			});
	});
});

describe('PUT /proyectos/:id', () => {
	it('updates an existing project', (done) => {
		const projectId = 1;
		const updatedProject = {
			nombre: 'Proyecto actualizado',
			descripcion: 'Descripción del proyecto actualizado',
			materia: 'Materia del proyecto actualizado',
			fecha_entrega: '2023-04-30',
			usuario_asignado: 'Usuario asignado al proyecto actualizado',
		};
		request(router)
			.put(`/proyectos/${projectId}`)
			.set('Authorization', 'Bearer <token>')
			.send(updatedProject)
			.expect(200)
			.then((response) => {
				expect(response.text).toBe('Proyecto actualizado exitosamente.');
				done();
			});
	});
});

describe('DELETE /proyectos/:id', () => {
	it('deletes an existing project', (done) => {
		const projectId = 1;
		request(router)
			.delete(`/proyectos/${projectId}`)
			.set('Authorization', 'Bearer <token>')
			.expect(200)
			.then((response) => {
				expect(response.text).toBe('Proyecto eliminado exitosamente.');
				done();
			});
	});
});