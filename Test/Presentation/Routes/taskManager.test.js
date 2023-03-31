const request = require('../Back-End/node_modules/supertest');
const router = require('../Back-End/taskManager');

describe('Pruebas de API para Tareas', () => {
    it('Debe obtener todas las tareas', () => {
      return request(router)
        .get('/tareas')
        .expect(200)
        .then((response) => {
          expect(response.body).toBeDefined();
          expect(response.body.length).toBeGreaterThan(0);
        });
    });
  
    it('Debe obtener una tarea específica', () => {
      return request(router)
        .get('/tareas/1')
        .expect(200)
        .then((response) => {
          expect(response.body).toBeDefined();
          expect(response.body[0].nombre).toBe('Tarea 1');
        });
    });
  
    it('Debe agregar una nueva tarea', () => {
      const tareaNueva = {
        nombre: 'Tarea nueva',
        descripcion: 'Descripción de tarea nueva',
        estado: 'pendiente',
        fecha_entrega: '2023-04-30',
        proyecto_asociado: 'Proyecto 1',
      };
      return request(router)
        .post('/tareas')
        .send(tareaNueva)
        .expect(200)
        .then((response) => {
          expect(response.text).toBe('Tarea agregada exitosamente.');
        });
    });
  
    it('Debe actualizar una tarea existente', () => {
      const tareaActualizada = {
        nombre: 'Tarea actualizada',
        descripcion: 'Descripción de tarea actualizada',
        estado: 'en progreso',
        fecha_entrega: '2023-05-31',
        proyecto_asociado: 'Proyecto 2',
      };
      return request(router)
        .put('/tareas/1')
        .send(tareaActualizada)
        .expect(200)
        .then((response) => {
          expect(response.text).toBe('Tarea actualizada exitosamente.');
        });
    });
  
    it('Debe eliminar una tarea existente', () => {
      return request(router)
        .delete('/tareas/1')
        .expect(200)
        .then((response) => {
          expect(response.text).toBe('Tarea eliminada exitosamente.');
        });
    });
  });