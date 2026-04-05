import jwt from "jsonwebtoken";
import "dotenv/config";

/**
 * Middlewares de autorizacao dinamico
 * @param verifyToken Verificação do token JWT
 */

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "Token não enviado",
    });
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expirado",
        code: "TOKEN_EXPIRED",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token inválido" });
    }

    return res.status(401).json({ error: "Acesso negado!" });
  }
};
export default verifyToken;

const verifyId = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não enviado" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.id = decode.id;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expirado",
        code: "TOKEN_EXPIRED",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token inválido" });
    }

    return res.status(401).json({ error: "Acesso negado!" });
  }
};
export { verifyId, verifyToken };
