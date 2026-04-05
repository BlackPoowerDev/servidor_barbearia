import {
  getUsers,
  createUsers,
  deleteUsers,
  getUser,
  updateUser,
} from "../controllers/users.js";
import express from "express";

import authorize from "../middlewares/verifyAccess.js";
import { verifyId } from "../middlewares/verifyJwt.js";
import verifyRatelimiter from "../middlewares/verifyRatelimiter.js";
import { globalLimiter, registerLimiter } from "../services/rateLimiter.js";
const routerUsers = express.Router();

routerUsers.get(
  "/",
  verifyRatelimiter(globalLimiter),
  authorize(["administrador"]),
  async (req, res) => {
    try {
      const users = await getUsers([""]);
      console.log(users);

      return res.status(200).json({
        users: users,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        error: "Erro ao buscar usuario",
      });
    }
  },
);

routerUsers.get(
  "/:id",
  verifyRatelimiter(globalLimiter),
  authorize(["barbeiro"]),
  async (req, res) => {
    const id = req.params.id;

    try {
      const user = await getUser(id);
      // console.log(user);

      return res.status(200).json({
        user,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        error: "Erro ao buscar usuario",
      });
    }
  },
);

routerUsers.post(
  "/create/:id_barbearia",
  verifyRatelimiter(registerLimiter),
  verifyId,
  async (req, res) => {
    const id_barbearia = req.params.id_barbearia;

    if (id_barbearia === req.id) {
      try {
        const users = await createUsers(id_barbearia, req.body);
        if (users.status) {
          console.log({
            status: true,
            access_token: users.access_token,
          });

          return res.status(200).json({
            status: true,
            access_token: users.access_token,
          });
        }

        if (!users.status) {
          console.log({
            status: false,
            mensagem: "Erro ao cadastrar usuario",
          });

          return res.status(401).json({
            status: false,
            mensagem: "Erro ao cadastrar usuario",
          });
        }
      } catch (error) {
        console.error(error);

        if (error.cause?.detail.includes("Chave (telefone)")) {
          return res.status(400).json({
            error: "Telefone já cadastrado",
          });
        }

        if (error.cause?.detail.includes("Chave (email)=")) {
          return res.status(400).json({
            error: "Email já cadastrado",
          });
        }

        return res.status(500).json({
          error: "Erro interno no servidor",
        });
      }
    } else {
      return res.status(403).json({
        error: "ID da barbearia não corresponde ao token de autenticação",
      });
    }
  },
);

routerUsers.delete(
  "/:id",
  verifyRatelimiter(globalLimiter),
  authorize(["administrador"]),
  async (req, res) => {
    const id = req.params.id;

    try {
      await deleteUsers(id);
      console.log("Usuario deletado com sucesso");

      return res.status(200).json({
        status: "Usuario deletado com sucesso",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Erro ao deletar usuario",
      });
    }
  },
);

routerUsers.patch(
  "/:id",
  verifyRatelimiter(globalLimiter),
  authorize(["administrador"]),
  async (req, res) => {
    const id = req.params.id;

    try {
      await updateUser(id, req.body);
      console.log("Usuario editado com sucesso");

      return res.status(200).json({
        status: "Usuario editado com sucesso",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Erro ao editar usuario",
      });
    }
  },
);

export default routerUsers;
