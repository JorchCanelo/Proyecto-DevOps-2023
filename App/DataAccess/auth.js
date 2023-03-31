const jwt = require('jsonwebtoken');
require('dotenv').config();

// generar un token JWT
function generarToken(usuario) {
    const payload = {
        username: usuario.username,
        password: usuario.password
    };

    process.env.SECRET_KEY = generateString(30);

    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });

}

// verificar un token JWT
function verificarToken(req, res, next) {
    try {

        const accessToken = req.headers['authorization'] || req.query.accesToken;

        if (!accessToken) {
            res.send('Acceso denegado');
        }

        jwt.verify(accessToken, process.env.SECRET_KEY, (err, user) => {

            if (err) {
                res.send('Aceso denegado, token expiró');
            } else {
                //process.env.TOKEN = accessToken;
                next();
            }

        });
    } catch {
        console.log("");
    }

}

function generateString(length) {
    let result = ' ';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

module.exports = { generarToken, verificarToken };