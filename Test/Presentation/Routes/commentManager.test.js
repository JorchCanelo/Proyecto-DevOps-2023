const request = require('../Back-End/node_modules/supertest');
const app = require('../Back-End/commentManager');

describe('Pruebas de rutas de comentarios', () => {
    it('Debería obtener todos los comentarios', async () => {
      const response = await request(app)
        .get('/comentarios')
        .set('Authorization', `Bearer ${token}`); // token de autenticación
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });
  
    it('Debería obtener un comentario por id', async () => {
      const id = 1; // id de un comentario existente
      const response = await request(app)
        .get(`/comentarios/${id}`)
        .set('Authorization', `Bearer ${token}`); // token de autenticación
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].id).toBe(id);
    });
  
    it('Debería crear un nuevo comentario', async () => {
      const comentario = {
        autor: 'Juan',
        contenido: 'Este es un nuevo comentario',
        fecha: new Date(),
        estado: 'activo',
        tarea_asociada: 1
      };
      const response = await request(app)
        .post('/comentarios')
        .send(comentario)
        .set('Authorization', `Bearer ${token}`); // token de autenticación
      expect(response.status).toBe(200);
      expect(response.text).toBe('Comentario agregado exitosamente.');
    });
  
    it('Debería actualizar un comentario existente', async () => {
      const id = 1; // id de un comentario existente
      const comentario = {
        autor: 'Pedro',
        contenido: 'Este es un comentario actualizado',
        fecha: new Date(),
        estado: 'inactivo',
        tarea_asociada: 2
      };
      const response = await request(app)
        .put(`/comentarios/${id}`)
        .send(comentario)
        .set('Authorization', `Bearer ${token}`); // token de autenticación
      expect(response.status).toBe(200);
      expect(response.text).toBe('Comentario actualizado exitosamente.');
    });
  
    it('Debería eliminar un comentario existente', async () => {
      const id = 1; // id de un comentario existente
      const response = await request(app)
        .delete(`/comentarios/${id}`)
        .set('Authorization', `Bearer ${token}`); // token de autenticación
      expect(response.status).toBe(200);
      expect(response.text).toBe('Comentario eliminado exitosamente.');
    });
  });