import {
  integer,
  pgTable,
  varchar,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const login_barbearia = pgTable("barbearias", {
  id_barbearia: varchar("id_barbearia", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  senha: varchar("senha", { length: 255 }).notNull(),
});

export const buscar_usuarios = pgTable("usuarios", {
  id_barbearia: varchar("id_barbearia", { length: 255 }).notNull(),

  nome: varchar("nome", { length: 255 }).notNull(),

  email: varchar("email", { length: 255 }).notNull().unique(),

  // senha: varchar("senha", { length: 255 }).notNull(),

  telefone: varchar("telefone", { length: 20 }).notNull().unique(),

  idade: integer("idade"),

  tipo: varchar("tipo", { length: 20 }).default("cliente"),

  // foto_perfil: varchar("foto_perfil", { length: 255 }),

  cortes_finalizados: integer("cortes_finalizados").default(0),

  bloqueado: boolean("bloqueado").default(false),

  data_cadastro: timestamp("data_cadastro").defaultNow(),
});
export const tabela_usuarios = pgTable("usuarios", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  id_cliente: varchar("id_cliente", { length: 255 }).notNull(),

  id_barbearia: varchar("id_barbearia", { length: 255 }).notNull(),

  nome: varchar("nome", { length: 255 }).notNull(),

  email: varchar("email", { length: 255 }).notNull().unique(),

  // senha: varchar("senha", { length: 255 }).notNull(),

  telefone: varchar("telefone", { length: 20 }).notNull().unique(),

  idade: integer("idade"),

  tipo: varchar("tipo", { length: 20 }).default("cliente"),

  // foto_perfil: varchar("foto_perfil", { length: 255 }),

  cortes_finalizados: integer("cortes_finalizados").default(0),

  bloqueado: boolean("bloqueado").default(false),

  data_cadastro: timestamp("data_cadastro").defaultNow(),
});

export const tabela_barbeiros = pgTable("barbeiros", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  id_barbearia: varchar("id_barbearia", { length: 255 }).notNull(),

  email: varchar("email", { length: 255 }).notNull().unique(),

  senha: varchar("senha", { length: 255 }).notNull(),

  telefone: varchar("telefone", { length: 20 }).notNull().unique(),

  foto_perfil: varchar("foto_perfil", { length: 255 }),

  tipo: varchar("tipo", { length: 20 }).default("cliente"),

  data_cadastro: timestamp("data_cadastro").defaultNow(),

  bloqueado: boolean("bloqueado").default(false),
});

export const tabela_barbearia = pgTable("barbearias", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  id_barbearia: varchar("id_barbearia", { length: 255 }).notNull(),

  nome: varchar("nome", { length: 255 }).notNull(),

  email: varchar("email", { length: 255 }).notNull().unique(),

  senha: varchar("senha", { length: 255 }).notNull(),

  telefone: varchar("telefone", { length: 20 }).notNull().unique(),

  data_cadastro: timestamp("data_cadastro").defaultNow(),
});

export const tabela_atualizar_barbearia = pgTable("barbearias", {
  nome_barbearia: varchar("nome_barbearia", { length: 255 }).notNull(),

  email: varchar("email", { length: 255 }).notNull().unique(),

  senha: varchar("senha", { length: 255 }),

  foto_perfil: varchar("foto_perfil", { length: 255 }),

  endereco: varchar("endereco", { length: 255 }),

  telefone: varchar("telefone", { length: 20 }),

  descricao: varchar("descricao", { length: 500 }),
});

export const tabela_servicos = pgTable("servicos", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  id_servico: varchar("id_servico", { length: 255 }).notNull(),

  id_barbearia: varchar("id_barbearia", { length: 255 }).notNull(),

  nome_servico: varchar("nome_servico", { length: 255 }).notNull(),

  preco: integer("preco").notNull(),

  duracao: integer("duracao").notNull(),

  ativo: boolean("ativo"),

  foto: varchar("foto", { length: 255 }),
});

export const tabela_agendamentos = pgTable("agendamentos", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  id_barbearia: varchar("id_barbearia", { length: 255 }).notNull(),

  id_cliente: varchar("id_cliente", { length: 255 }).notNull(),

  id_barbeiro: integer("id_barbeiro").notNull(),

  id_servico: integer("id_servico").notNull(),

  data_agendamento: timestamp("data_agendamento").notNull(),

  status: varchar("status", { length: 50 }),

  data_criacao: timestamp("data_criacao").defaultNow(),
});

export const tabela_barbearia_fotos = pgTable("barbearia_fotos", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  id_barbearia: varchar("id_barbearia", { length: 255 }).notNull(),

  url_foto: varchar("url_foto", { length: 255 }).notNull(),
});

export const agenda_slots = pgTable("agenda_slots", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  id_slot: varchar("id_slot").notNull().unique(),

  id_barbearia: varchar("id_barbearia")
    .notNull()
    .references(() => barbearias.id_barbearia),

  id_barbeiro: varchar("id_barbeiro")
    .notNull()
    .references(() => barbeiros.id_barbeiro),

  horario: timestamp("horario").notNull(),

  disponivel: boolean("disponivel").default(true),

  data_criacao: timestamp("data_criacao").defaultNow(),
});
