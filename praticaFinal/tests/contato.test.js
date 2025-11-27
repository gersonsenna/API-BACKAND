const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const Contato = require("../models/contatoModel");

let mongoServer;
let token = "";
let contatoCriado = "";

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Autenticação", () => {
  test("Registrar contato e retornar token", async () => {
    const res = await request(app)
      .post("/api/contatos")
      .send({
        nome: "Senna",
        email: "senna@test.com",
        telefone: "99999-9999",
        senha: "123456"
      });

    expect(res.status).toBe(201);
    expect(res.body.novo).toBeDefined();
  });

  test("Login e retorno de token", async () => {
    const res = await request(app)
      .post("/api/usuarios/login")
      .send({
        email: "senna@test.com",
        senha: "123456"
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });
});

describe("CRUD de Contatos", () => {
  test("Criar contato autenticado", async () => {
    const res = await request(app)
      .post("/api/contatos")
      .set("Authorization", "Bearer " + token)
      .send({
        nome: "Contato 2",
        email: "contato2@test.com",
        telefone: "8888-0000",
        senha: "123456"
      });

    expect(res.status).toBe(201);
    expect(res.body.novo).toBeDefined();
    contatoCriado = res.body.novo._id;
  });

  test("Listar contatos", async () => {
    const res = await request(app)
      .get("/api/contatos")
      .set("Authorization", "Bearer " + token);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Buscar contato por ID", async () => {
    const res = await request(app)
      .get(`/api/contatos/${contatoCriado}`)
      .set("Authorization", "Bearer " + token);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(contatoCriado);
  });

  test("Atualizar contato", async () => {
    const res = await request(app)
      .put(`/api/contatos/${contatoCriado}`)
      .set("Authorization", "Bearer " + token)
      .send({ telefone: "1111-2222" });

    expect(res.status).toBe(200);
    expect(res.body.contato.telefone).toBe("1111-2222");
  });

  test("Deletar contato", async () => {
    const res = await request(app)
      .delete(`/api/contatos/${contatoCriado}`)
      .set("Authorization", "Bearer " + token);

    expect(res.status).toBe(204);
  });
});

describe("Proteção JWT", () => {
  test("Negar acesso sem token", async () => {
    const res = await request(app).get("/api/contatos");
    expect(res.status).toBe(401);
  });

  test("Negar acesso com token inválido", async () => {
    const res = await request(app)
      .get("/api/contatos")
      .set("Authorization", "Bearer 123abc");

    expect(res.status).toBe(403);
  });
});
