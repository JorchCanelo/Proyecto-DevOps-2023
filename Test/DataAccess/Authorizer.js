const jwt = require('jsonwebtoken');

const Authorizer = {
    verificarToken: (req, res, next) => {
        // Simulación de verificación de token
        const token = req.headers.authorization;
        if (!token) return res.status(401).send('Se requiere token de autenticación');

        try {
            const decoded = jwt.verify(token, 'secret');
            req.user = decoded;
            next();
        } catch (ex) {
            res.status(400).send('Token no válido');
        }
    },

    generarToken: (payload) => {
        // Simulación de generación de token
        return jwt.sign(payload, 'secret', { expiresIn: '1h' });
    }
}

module.exports = Authorizer;