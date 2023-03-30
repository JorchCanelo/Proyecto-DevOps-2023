const jwt = require('jsonwebtoken');
var secretKey = "";
// generar un token JWT
function generarToken(usuario) {
  const payload = {
    username: usuario.username,
    password: usuario.password
  };

  secretKey = generateString(30);

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

// verificar un token JWT
function verificarToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ mensaje: "No se proporcionó un token" });
  }

  jwt.verify(token, secretKey, function(err, decodedToken) {
    if (err) {
      return res.status(401).json({ mensaje: "Token no válido" });
    }
    req.usuario = decodedToken;
    next();
  });
}

function generateString(length) {
    let result = ' ';
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

module.exports = { generarToken, verificarToken };