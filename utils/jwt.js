import jwt from "jsonwebtoken";
import "dotenv/config";

export const jwtUsers = (data) => {
  return jwt.sign(
    {
      id: data.id_barbearia,
      tipo: data.tipo,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};
