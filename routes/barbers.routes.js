import { log } from "console";
import {
  barberShop,
  getBarbers,
  deleteBarbers,
  getBarber,
  updateBarbers,
  loginBarber,
  createBarbers,
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
  authorize(["administrador"]),
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

// Cadastrar barbearia
routerBarbers.post(
  "/create",
  verifyRatelimiter(registerLimiter),
  async (req, res) => {
    try {
      const barber = await barberShop(req.body);

      if (!barber.status) {
        console.log({
          status: false,
          mensagem: "Erro ao cadastrar usuario",
        });

        return res.status(401).json({
          status: false,
          mensagem: "Erro ao cadastrar usuario",
        });
      }

      console.log({
        status: true,
        access_token: barber.access_token,
      });

      return res.status(200).json({
        status: true,
        id: barber.id_barbearia,
        access_token: barber.access_token,
      });
    } catch (error) {
      // if (error.cause?.detail.includes("Chave (telefone)")) {
      return res.status(500).json({
        status: false,
        error: error.cause?.detail,
      });
      // }

      // if (error.cause?.detail.includes("Chave (email)=")) {
      //   return res.status(400).json({
      //     status: false,
      //     error: "Email já cadastrado",
      //   });
      // }

      // if (error.cause?.column === "nome") {
      //   return res.status(400).json({
      //     status: false,
      //     error: "Nome invalido",
      //   });
      // }

      // return res.status(500).json({
      //   status: false,
      //   error: "error interno no servidor",
      // });
    }
  },
);

routerBarbers.post(
  "/create/barber/:id_barbearia",
  verifyRatelimiter(registerLimiter),
  verifyToken,
  async (req, res) => {
    // console.log(req);

    try {
      const id_barbearia = req.params.id_barbearia;

      if (!id_barbearia)
        return {
          status: false,
          mensagem: "ID da barbearia não informado",
        };

      const barber = await createBarbers(id_barbearia, req.body);

      if (barber.rowCount) {
        return res.status(200).json({
          status: true,
          id_barbearia: id_barbearia,
        });
      }

      if (barber?.cause.code === "23505") {
        return res.status(400).json({
          status: false,
          mensagem: "Erro ao cadastrar barbeiro (Telefone já cadastrado)",
        });
      }

      return res.status(500).json({
        status: false,
        mensagem: "Erro interno do servidor)",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        mensagem: "Erro interno do servidor)",
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
  verifyRatelimiter(loginLimiter),
  async (req, res) => {
    try {
      const login = await loginBarber(req.body);

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

      console.log({
        status: true,
        access_token: login.access_token,
      });

      return res.status(200).json({
        status: true,
        id: login.id_barbearia,
        access_token: login.access_token,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Erro ao fazer login",
      });
    }
  },
);

export default routerBarbers;
