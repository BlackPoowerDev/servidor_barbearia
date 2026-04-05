import {
  createBarbers,
  getBarbers,
  deleteBarbers,
  getBarber,
  updateBarbers,
  loginBarber,
} from "../controllers/barbers.js";
import authorize from "../middlewares/verifyAccess.js";
import { verifyToken } from "../middlewares/verifyJwt.js";

import verifyRatelimiter from "../middlewares/verifyRatelimiter.js";
import {
  globalLimiter,
  registerLimiter,
  loginLimiter,
} from "../services/rateLimiter.js";

import express from "express";
const routerBarbers = express.Router();

routerBarbers.get(
  "/validate",
  verifyRatelimiter(globalLimiter),
  verifyToken,
  async (req, res) => {
    try {
      if (req.user) {
        return res.status(200).json({
          status: true,
          user: req.user,
        });
      }
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Erro ao buscar barbeiros",
      });
    }
  },
);

routerBarbers.get(
  "/",
  verifyRatelimiter(globalLimiter),
  authorize(["barbeiros"]),
  async (req, res) => {
    try {
      const barbers = await getBarbers();
      console.log(barbers);

      return res.status(200).json({
        barbers,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Erro ao buscar barbeiros",
      });
    }
  },
);

routerBarbers.get(
  "/:id",
  verifyRatelimiter(globalLimiter),
  async (req, res) => {
    const id = req.params.id;
    try {
      const barber = await getBarber(id);
      // console.log(barber);

      return res.status(200).json({
        barber,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        status: false,
        mensagem: "Erro ao buscar barbeiros",
      });
    }
  },
);

routerBarbers.post(
  "/create",
  verifyRatelimiter(registerLimiter),
  async (req, res) => {
    try {
      const users = await createBarbers(req.body);

      if (users.status) {
        console.log({
          status: true,
          access_token: users.access_token,
        });

        return res.status(200).json({
          status: true,
          id: users.id_barbearia,
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
      if (error.cause?.detail.includes("Chave (telefone)")) {
        return res.status(400).json({
          satus: false,
          error: "Telefone já cadastrado",
        });
      }

      if (error.cause?.detail.includes("Chave (email)=")) {
        return res.status(400).json({
          satus: false,
          error: "Email já cadastrado",
        });
      }

      if (error.cause?.column === "nome") {
        return res.status(400).json({
          satus: false,
          error: "Nome invalido",
        });
      }

      return res.status(500).json({
        error: error,
      });
    }
  },
);

routerBarbers.delete(
  "/:id",
  verifyRatelimiter(globalLimiter),
  authorize(["barbeiros"]),
  async (req, res) => {
    const id = req.params.id;

    try {
      await deleteBarbers(id);
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

routerBarbers.patch(
  "/:id",
  verifyRatelimiter(globalLimiter),
  authorize(["barbeiros"]),
  async (req, res) => {
    const id = req.params.id;

    try {
      await updateBarbers(id, req.body);
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

// ROTA DE LOGIN
routerBarbers.post(
  "/login",
  verifyRatelimiter(globalLimiter),
  async (req, res) => {
    try {
      const login = await loginBarber(req.body);

      if (login.status) {
        console.log({
          status: true,
          access_token: login.access_token,
        });

        return res.status(200).json({
          status: true,
          id: login.id_barbearia,
          access_token: login.access_token,
        });
      }

      if (!login.status) {
        console.log({
          status: false,
          mensagem: "Erro ao fazer login",
        });

        return res.status(401).json({
          status: false,
          mensagem: "Credenciais invalidas!",
        });
      }
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Erro ao fazer login",
      });
    }
  },
);

export default routerBarbers;
