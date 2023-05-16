const jwt = require('jsonwebtoken');
require('dotenv').config();

// generar un token JWT
function generarToken(usuario) {
    const payload = {
        username: usuario.username,
        password: usuario.password
    };

    const secretKey = generateString(30);
    const token = jwt.sign(payload, secretKey, { expiresIn: '10h' });

    responseToken = {
        secretKey: secretKey,
        token: token,
    }



    return responseToken;

}

// verificar un token JWT
function verificarToken(req, res, next) {
    try {

        const accessToken = req.headers['authorization'] || req.query.accessToken;

        const secretKey = req.query.secretKey;


        if (!accessToken) {
            res.send('Acceso denegado');
        }

        jwt.verify(accessToken, secretKey, (err, user) => {

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
