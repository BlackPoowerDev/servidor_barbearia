import { tabela_usuarios, buscar_usuarios } from "../config/tables.js";
import uploadImage from "../services/cloudnary.js";
import db from "../models/database.js";
import { jwtUsers } from "../utils/jwt.js";
import { v6 as uuidv6 } from "uuid";
import { eq, sql } from "drizzle-orm";
import bcrypt from "bcrypt";

import path from "path";
const __dirname = path.resolve();

export async function getUser(id) {
  return await db
    .select()
    .from(buscar_usuarios)
    .where(eq(buscar_usuarios.id_barbearia, id));
}
export async function getUsers(authorize = []) {
  if (authorize.includes("*")) {
    return await db.select().from(tabela_usuarios);
  }
  return await db
    .select()
    .from(tabela_usuarios)
    .where(sql`not ${tabela_usuarios.tipo} = 'administrador'`);
}
export async function createUsers(id_barbearia, dados) {
  // if(dados.tipo === 'administrador'){
  //     return {
  //         status: false,
  //         mensagem: 'Erro ao cadastrar usuario'
  //     };
  // }
  // const upload = await uploadImage(path.join(__dirname, dados.foto_perfil));

  const id_cliente = uuidv6();

  const result = await db
    .insert(tabela_usuarios)
    .values({
      id_cliente: id_cliente,
      id_barbearia: id_barbearia,
      nome: dados.nome,
      email: dados.email,
      // senha: await bcrypt.hash(dados.senha, 10),
      telefone: dados.telefone,
      idade: dados.idade,
      tipo: "cliente",
      data_cadastro: new Date(),
      bloqueado: false,
      cortes_finalizados: 0,
      // foto_perfil: multiavatar('Binx Bond') ?? ''
    })
    .returning();

  if (result.length > 0) {
    const data = {
      id_cliente: id_cliente,
      // tipo: dados.tipo,
      // foto_perfil: upload?.url ?? ''
    };

    return {
      status: true,
      id: id_cliente,
      access_token: jwtUsers(data),
    };
  }

  return {
    status: false,
    mensagem: result,
  };
}
export async function deleteUsers(id) {
  return await db
    .delete(tabela_usuarios)
    .where(eq(tabela_usuarios.id_cliente, id));
}

export async function updateUser(id, dados) {
  return await db
    .update(tabela_usuarios)
    .set(dados)
    .where(eq(tabela_usuarios.id_cliente, id));
}
