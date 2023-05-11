const express = require('express');
const router = express.Router();
const connection = require('../../dataAccess/databaseConnection');
const authorizer = require('../../dataAccess/authorizer');
const { logger, debug, obfuscateSensitiveData } = require('../../dataAccess/logger');

//historial

router.get('/historial', authorizer.verificarToken, (req, res) => {
	connection.query('SELECT * FROM historial', (err, rows, fields) => {
		if (!err)
			res.json({ rows });
		else
			res.status(500).json({ error });
	})
// Loggear llamada de la API en INFO
logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)} - Headers: ${JSON.stringify(req.headers)}`);

// Loggear body de la llamada en DEBUG
debug.debug(`Request body: ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

connection.query('SELECT * FROM historial', (err, results) => {
try {
	if (error) {
		logger.error(error.stack || error);
		res.status(500).json({ error: 'Error al obtener historial' });
	} else {
		res.json(results);
	}
} catch (catchError) {
	logger.error(error.stack || catchError);
	res.status(500).json({ catchError: 'Error al obtener historial' });
}
});
});



router.get('/historial/:id', authorizer.verificarToken, (req, res) => {
	connection.query('SELECT * FROM historial WHERE proyecto_asignado = ?', [req.params.id], (err, rows, fields) => {
		if (!err)
			res.json({ rows });
		else
			res.status(500).json({ error });
	})


const id = req.params.id;

   	 // Loggear llamada de la API en INFO
   	 logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)} - Headers: ${JSON.stringify(req.headers)}`);

   	 // Loggear body de la llamada en DEBUG
   	 debug.debug(`Request body: ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

	connection.query('SELECT * FROM historial WHERE id = ?', [id], (error, results) => {

        try {
            if (error) {
                logger.error(error.stack || error);
                res.status(500).json({ error: 'Error al obtener el historial' });
            } else if (results.length === 0) {
                debug.warn(`Error de validacion: El historial con el id ${id} no existe.`);
                res.status(404).json({ error: 'Historial no encontrado' });
            } else {
                res.json(results[0]);
            }
        } catch (catchError) {
            logger.error(error.stack || catchError);
            res.status(500).json({ catchError: 'Error al obtener el historial solicitado' });
        }
    });
});

router.post('/historial', authorizer.verificarToken, (req, res) => {
	let registro = req.body;
	var sql = "INSERT INTO historial (fecha_cambio, detalle_cambio, responsable, proyecto_asignado) VALUES (?, ?, ?, ?)";
	connection.query(sql, [registro.fecha_cambio, registro.detalle_cambio, registro.responsable, registro.proyecto_asignado], (err, rows, fields) => {
		if (!err)
			res.json({ message: 'Registro de historial agregado exitosamente.' });
		else
			res.status(500).json({ error });
	})

	var sql = "INSERT INTO historial SET ?";

	 // Loggear llamada de la API en INFO
    	logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)} - Headers: ${JSON.stringify(req.headers)}`);

    	// Loggear body de la llamada en DEBUG
    	debug.debug(`Request body: ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

	connection.query(sql, { fecha_cambio: registro.fecha_cambio, detalle_cambio: registro.detalle_cambio, responsable: registro.responsable, proyecto_asignado: registro.proyecto_asignado}, async (error, results) => {
	   try {
            if (error.code === 'ER_DUP_ENTRY') {
                debug.warn(`Error de validacion: La entrada ${obfuscateSensitiveData(registro.proyecto_asignado)} no es válida`);
                res.status(400).json({ error: `${registro.proyecto_asignado} no válido.` });
            } else {
                res.json('Registro exitoso.')
            }
        } catch (catchError) {
            logger.error(catchError.stack || catchError);
            res.status(500).json({ error: catchError });
        }

    })
});


router.put('/historial/:id', authorizer.verificarToken, (req, res) => {
	let registro = req.body;
	var sql = "UPDATE historial SET fecha_cambio = ?, detalle_cambio = ?, responsable = ?, proyecto_asignado = ? WHERE id = ?";
	connection.query(sql, [registro.fecha_cambio, registro.detalle_cambio, registro.responsable, registro.proyecto_asignado, req.params.id], (err, rows, fields) => {
		if (!err)
			res.json({ message: 'Registro de historial actualizado exitosamente.' });
		else
			res.status(500).json({ error });
	})

    const id = req.params.id;
	var sql = "UPDATE historial SET ? WHERE id = ?";
	const { fecha_cambio, detalle_cambio, responsable, proyecto_asignado } = req.body;
    const updatedHistory = { fecha_cambio, detalle_cambio, responsable, proyecto_asignado };

	 // Loggear llamada de la API en INFO
   	 logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)} - Headers: ${JSON.stringify(req.headers)}`);

   	 // Loggear body de la llamada en DEBUG
    	debug.debug(`Request body: ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

	connection.query(sql, [updatedHistory, id], (error, result) => {
		 try {
            if (error) {
                logger.error(error.stack || error);
                res.status(500).json('Error al actualizar historial');
            } else if (result.affectedRows === 0) {
                debug.warn(`Error de validacion: El historial con el id ${id} no existe.`);
                res.status(404).json({ error: 'Historial no encontrado' });
            } else {
                updatedHistory.id = id;
                res.json(updatedHistory);
            }
        } catch (catchError) {
            logger.error(error.stack || catchError);
            res.status(500).json({ catchError: 'Error al obtener el historial' });
        }
    })
});



router.delete('/historial/:id', authorizer.verificarToken, (req, res) => {
	const id = req.params.id;
	connection.query('DELETE FROM historial WHERE id = ?', id, (error, results) => {
		if (error) {
			res.status(500).json({ error });
		} else if (results.affectedRows === 0) {
			res.status(404).json({ message: 'Historial no encontrado' });
		} else {
			res.json({ message: 'Historial eliminado' });
		}
	})

	// Loggear llamada de la API en INFO
	   logger.info(`${req.method} ${req.originalUrl} - Query parameters: ${JSON.stringify(req.query)} - Headers: ${JSON.stringify(req.headers)}`);

	   // Loggear body de la llamada en DEBUG
	   debug.debug(`Request body: ${JSON.stringify(obfuscateSensitiveData(req.body))}`);

   connection.query('DELETE FROM historial WHERE id = ?', [id], (error, result) => {
		 try {
		   if (error) {
			   logger.error(error.stack || error);
			   res.status(500).json({ error: 'Error al eliminar el historial' });
		   } else if (result.affectedRows === 0) {
			   debug.warn(`Error de validacion:El historial con el id ${id} no existe.`);
			   res.status(404).json({ error: 'Historial no encontrado' });
		   } else {
			   res.sendStatus(204);
		   }
	   } catch (catchError) {
		   logger.error(error.stack || catchError);
		   res.status(500).json({ catchError: 'Error al obtener el historial solicitado' });
	   }
   });
});

module.exports = router;
