import {
  tabela_barbearia,
  tabela_barbeiros,
  login_barbearia,
} from "../config/tables.js";
import db from "../models/database.js";
import { jwtUsers } from "../utils/jwt.js";
import uploadImage from "../services/cloudnary.js";

import { v6 as uuidv6 } from "uuid";
import { eq, and, gt, lt } from "drizzle-orm";
import bcrypt from "bcrypt";
import path from "path";

const __dirname = path.resolve();

export async function validBarbers() {
  try {
    // return await verifyToken()
  } catch (error) {
    console.log(error);
  }
}

export async function createBarbers(dados) {
  const id_barbearia = uuidv6();

  const result = await db.insert(tabela_barbearia).values({
    id_barbearia: id_barbearia,
    email: dados.email ? dados.email : "",
    nome: dados.nome ? dados.nome : "",
    senha: await bcrypt.hash(dados.senha, 10),
    // nome_barbearia: dados.nome_barbearia ? dados.nome_barbearia : '',
    // foto_logo: dados.foto_perfil ? await uploadImage(path.join(__dirname, dados.foto_logo)) : '',
    // endereco: dados.endereco ? dados.endereco : '',
    telefone: dados.telefone ? dados.telefone : "",
    // descricao: dados.descricao ? dados.descricao : '',
    // avaliacao_media: dados.avaliacao_media ? dados.avaliacao_media : 0,
    data_cadastro: new Date(),
  });

  if (result.rowCount > 0) {
    const data = {
      id_barbearia: id_barbearia,
      nome: dados.nome ? dados.nome : "",
      tipo: "barbeiro",
    };

    return {
      status: true,
      id_barbearia: id_barbearia,
      access_token: jwtUsers(data),
    };
  }

  return {
    status: false,
    mensagem: result,
  };
}
export async function getBarber(id) {
  return await db
    .select()
    .from(tabela_barbeiros)
    .where(eq(tabela_barbeiros.id_barbearia, id));
}
export async function getBarbers() {
  return await db.select().from(tabela_barbeiros);
}
export async function deleteBarbers(id) {
  return await db
    .delete(tabela_barbeiros)
    .where(eq(tabela_barbeiros.id_barbearia, id));
}
export async function updateBarbers(id, dados) {
  return await db
    .update(tabela_barbeiros)
    .set(dados)
    .where(eq(tabela_barbeiros.id_barbearia, id));
}
export async function loginBarber(dados) {
  try {
    const [user] = await db
      .select()
      .from(login_barbearia)
      .where(eq(login_barbearia.email, dados.email));

    if (!user) {
      return {
        status: false,
        mensagem: "Dados incorretos",
      };
    }

    const result = await bcrypt.compare(dados.senha, user.senha);

    if (result === true) {
      return {
        status: true,
        id_barbearia: user.id_barbearia,
        access_token: jwtUsers({
          id_barbearia: user.id_barbearia,
          tipo: "barbeiro",
        }),
      };
    }

    return {
      status: false,
      mensagem: "Dados incorretos",
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      mensagem: "Erro ao realizar login",
    };
  }
}
