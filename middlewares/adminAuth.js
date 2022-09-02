import jwt from "jsonwebtoken";
import secret from "../helpers/secret";

export default function adminAuth(request, response, next) {
  const authToken = request.headers["authorization"];
  if (authToken != undefined) {
    const bearer = authToken.split(" ");
    const token = bearer[1];
    try {
      const decoded = jwt.verify(token, secret);
      if (decoded.role == 1) {
        next();
      } else {
        response.status(403).json({
          msg: "Você não tem permissão para isso!",
        });
      }
    } catch (error) {
      response.status(403).json({
        msg: "Você não está autenticado!",
      });
    }
  } else {
    response.status(403).json({
      msg: "Token inválido!",
    });
  }
}
